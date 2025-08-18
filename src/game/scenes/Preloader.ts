import { Scene } from "phaser"

export class Preloader extends Scene {
    constructor() {
        super("Preloader")
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background")

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress
        })
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets")

        this.load.image("arena", "spirit-blossom-arena.jpg")
        this.load.image("logo", "logo.png")
        this.load.image("star", "star.png")

        this.loadCharacterSpritesheets()
        this.loadParticles()
    }

    create() {
        this.scene.start("Game")
    }

    loadCharacterSpritesheets() {
        const available_sheets = ["rogue", "knight", "archer"]

        for (const character_sheet of available_sheets) {
            this.load.spritesheet(character_sheet, `spritesheets/characters/${character_sheet}.png`, {
                frameWidth: 64,
                frameHeight: 64,
            })
        }
    }

    loadParticles() {
        this.load.image("blood", "particles/blood.png")
        this.load.image("arrow", "particles/arrow.webp")

        this.textures.exists("parry") ||
            (() => {
                const g = this.add.graphics()
                g.fillStyle(0xffff00, 1)
                g.fillRect(0, 0, 50, 16)
                g.generateTexture("parry", 50, 16)
                g.destroy()
            })()
    }
}
