import { Character, CharacterGroup } from "../characters/Character"
import { Rogue } from "../characters/Rogue"
import { EventBus } from "../EventBus"
import { Scene } from "phaser"

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    gameText: Phaser.GameObjects.Text
    teamA: CharacterGroup
    teamB: CharacterGroup

    constructor() {
        super("Game")
    }

    create() {
        this.camera = this.cameras.main
        // this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(800, 512, "arena")
        this.background.setDepth(-1)
        // this.background.setScale(2)
        // this.background.setAlpha(0.1);

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

        this.teamB = this.physics.add.group({ runChildUpdate: true })
        const knight = new Character(this, this.camera.width / 2.5, this.camera.height / 2.5, "knight")
        const knight2 = new Character(this, this.camera.width / 1.5, this.camera.height / 2.5, "knight")
        this.teamB.add(knight)
        this.teamB.add(knight2)

        this.physics.add.overlap(this.teamA, this.teamA)
        this.physics.add.overlap(this.teamA, this.teamB)
        this.physics.add.overlap(this.teamB, this.teamB)

        EventBus.emit("current-scene-ready", this)
    }

    changeScene() {
        this.scene.start("GameOver")
    }

    update(time: number, delta: number): void {}
}
