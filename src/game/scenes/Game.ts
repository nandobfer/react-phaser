import { Character, CharacterGroup } from "../characters/Character"
import { EventBus } from "../EventBus"
import { Scene } from "phaser"

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    gameText: Phaser.GameObjects.Text
    characters: CharacterGroup
    enemies: CharacterGroup

    constructor() {
        super("Game")
    }

    create() {
        this.camera = this.cameras.main
        // this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(800, 512, "arena")
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

        this.characters = this.physics.add.group({ runChildUpdate: true })
        const rogue = new Character(this, this.camera.width / 2, this.camera.height / 2, "rogue")
        this.characters.add(rogue)
        
        this.enemies = this.physics.add.group({ runChildUpdate: true })
        const knight = new Character(this, this.camera.width / 3, this.camera.height / 3, "knight")
        this.enemies.add(knight)

        this.physics.add.collider(this.characters, this.characters)
        this.physics.add.collider(this.characters, this.enemies, (a, b) => {
            a.handleCollisionWithEnemy()
            b.handleCollisionWithEnemy()
        })
        this.physics.add.collider(this.enemies, this.enemies)

        EventBus.emit("current-scene-ready", this)
    }

    changeScene() {
        this.scene.start("GameOver")
    }

    update(time: number, delta: number): void {}
}
