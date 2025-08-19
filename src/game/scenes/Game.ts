import { Archer } from "../characters/Archer"
import { Character, CharacterGroup } from "../characters/Character"
import { Knight } from "../characters/Knight"
import { Rogue } from "../characters/Rogue"
import { EventBus } from "../EventBus"
import { Scene } from "phaser"

export type GameState = "fighting" | "idle"

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    gameText: Phaser.GameObjects.Text
    teamA: CharacterGroup
    teamB: CharacterGroup
    state: GameState = "idle"
    walls: Phaser.GameObjects.Group

    constructor() {
        super("Game")
    }

    create() {
        this.camera = this.cameras.main
        // this.camera.setBackgroundColor(0x00ff00);

        this.createBackground()

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

        this.teamA = this.physics.add.group({ runChildUpdate: true })
        const rogue = new Rogue(this, this.camera.width / 2, this.camera.height / 2)
        this.teamA.add(rogue)
        const archer = new Archer(this, this.camera.width / 2.2, this.camera.height / 1.8)
        this.teamA.add(archer)

        this.teamB = this.physics.add.group({ runChildUpdate: true })
        const knight = new Knight(this, this.camera.width / 2.5, this.camera.height / 2.5)
        const knight2 = new Knight(this, this.camera.width / 1.5, this.camera.height / 2.5)
        this.teamB.add(knight)
        this.teamB.add(knight2)

        this.physics.add.overlap(this.teamA, this.teamA)
        this.physics.add.overlap(this.teamA, this.teamB)
        this.physics.add.overlap(this.teamB, this.teamB)

        this.physics.add.collider(this.walls, this.teamA)
        this.physics.add.collider(this.walls, this.teamB)

        EventBus.emit("current-scene-ready", this)
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

    changeScene() {
        this.scene.start("GameOver")
    }

    changeState(state: GameState) {
        this.state = state
        EventBus.emit("gamestate", this.state)
    }

    update(time: number, delta: number): void {}
}
