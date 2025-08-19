// src/game/scenes/Game.ts

import { CharacterGroup } from "../characters/CharacterGroup"
import { Knight } from "../characters/Knight"
import { EventBus } from "../EventBus"
import { Scene } from "phaser"
import { Grid } from "../Grid"
import { CharacterDto } from "../characters/Character"
import { CharacterRegistry } from "../characters/CharacterRegistry"

export type GameState = "fighting" | "idle"

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    gameText: Phaser.GameObjects.Text
    playerTeam: CharacterGroup
    enemyTeam: CharacterGroup
    state: GameState = "idle"
    walls: Phaser.GameObjects.Group
    stage = 1
    grid: Grid

    constructor() {
        super("Game")
    }

    create() {
        this.camera = this.cameras.main
        // this.camera.setBackgroundColor(0x00ff00);

        this.createBackground()
        this.grid = new Grid(this, this.background)

        // this.gameText = this.add
        //     .text(512, 384, "Make something fun!\nand share it with us:\nsupport@phaser.io", {
        //         fontFamily: "Arial Black",
        //         fontSize: 38,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100)

        // const rogue = new Rogue(this, this.camera.width / 2, this.camera.height / 2)
        // const archer = new Archer(this, this.camera.width / 2.2, this.camera.height / 1.8)

        this.playerTeam = new CharacterGroup(this, [], { isPlayer: true })

        const knight = new Knight(this, this.camera.width / 2.5, this.camera.height / 2.5, "123")
        const knight2 = new Knight(this, this.camera.width / 1.5, this.camera.height / 2.5, "321")
        this.enemyTeam = new CharacterGroup(this, [knight, knight2])

        this.configurePhysics()

        this.enemyTeam.reset()

        this.loadPlayerCharacters()

        EventBus.emit("game-ready", this)
    }

    createBackground() {
        this.background = this.add.image(this.camera.width / 2, this.camera.height / 2, "arena")
        this.background.setDepth(-2)
        this.background.setScale(0.6)

        // Walls (invisible colliders)
        const thickness = 50 // adjust to match your arena border thickness
        const arenaWidth = this.background.displayWidth
        const arenaHeight = this.background.displayHeight
        const centerX = this.camera.width / 2
        const centerY = this.camera.height / 2

        this.walls = this.physics.add.staticGroup()

        // Top wall
        this.walls
            .create(centerX, centerY + 68 - arenaHeight / 2)
            .setDisplaySize(arenaWidth, thickness)
            .setVisible(false)
            .refreshBody()

        // Bottom wall
        this.walls
            .create(centerX, centerY - 90 + arenaHeight / 2)
            .setDisplaySize(arenaWidth, thickness)
            .setVisible(false)
            .refreshBody()

        // Left wall
        this.walls
            .create(centerX + 72 - arenaWidth / 2, centerY)
            .setDisplaySize(thickness, arenaHeight)
            .setVisible(false)
            .refreshBody()

        // Right wall
        this.walls
            .create(centerX - 72 + arenaWidth / 2, centerY)
            .setDisplaySize(thickness, arenaHeight)
            .setVisible(false)
            .refreshBody()
    }

    configurePhysics() {
        this.physics.add.overlap(this.playerTeam, this.playerTeam)
        this.physics.add.overlap(this.playerTeam, this.enemyTeam)
        this.physics.add.overlap(this.enemyTeam, this.enemyTeam)

        this.physics.add.collider(this.walls, this.playerTeam)
        this.physics.add.collider(this.walls, this.enemyTeam)
    }

    changeScene() {
        this.scene.start("GameOver")
    }

    changeState(state: GameState) {
        this.state = state
        EventBus.emit("gamestate", this.state)
    }

    finishRound() {
        this.playerTeam.reset()
    }

    anyTeamWiped() {
        const aliveEnemyCharacters = this.enemyTeam.countActive()
        const alivePlayerCharacters = this.playerTeam.countActive()
        return aliveEnemyCharacters === 0 || alivePlayerCharacters === 0
    }

    getSavedCharacters(): CharacterDto[] {
        try {
            const data = localStorage.getItem("characters")
            if (data) {
                return JSON.parse(data) as CharacterDto[]
            }
        } catch (error) {
            console.error("Error loading saved characters:", error)
        }
        return []
    }

    loadPlayerCharacters() {
        this.playerTeam.clear(true, true)
        const characters = this.getSavedCharacters()

        for (const dto of characters) {
            try {
                const character = CharacterRegistry.create(dto.name, this, dto.boardX, dto.boardY, dto.id)
                character.loadFromDto(dto)
                this.playerTeam.add(character)
            } catch (error) {
                console.error("Error creating character:", error)
            }
        }

        this.playerTeam.reset()

        if (this.playerTeam.getLength() === 0) {
            this.chooseNewCharacter()
        }
    }

    savePlayerCharacters(characters: CharacterDto[]) {
        try {
            localStorage.setItem("characters", JSON.stringify(characters))
        } catch (error) {
            console.error("Error saving characters:", error)
        }
    }

    newPlayerCharacter(dto: CharacterDto) {
        const characters = this.getSavedCharacters()

        // Check if character with this ID already exists
        const existingIndex = characters.findIndex((c) => c.id === dto.id)
        if (existingIndex >= 0) {
            // Update existing character
            characters[existingIndex] = dto
        } else {
            // Add new character
            characters.push(dto)
        }

        this.savePlayerCharacters(characters)
        this.loadPlayerCharacters() // Reload to reflect changes
    }

    // Add this method to remove a character
    removePlayerCharacter(characterId: string) {
        const characters = this.getSavedCharacters()
        const filteredCharacters = characters.filter((c) => c.id !== characterId)
        this.savePlayerCharacters(filteredCharacters)
        this.loadPlayerCharacters()
    }

    // Add this method to clear all characters
    clearAllCharacters() {
        this.savePlayerCharacters([])
        this.loadPlayerCharacters()
    }

    chooseNewCharacter() {
        EventBus.emit("choose-character")
    }

    update(time: number, delta: number): void {
        if (this.state === "fighting") {
            if (this.anyTeamWiped()) {
                this.changeState("idle")
                this.finishRound()
            }
        }
    }
}
