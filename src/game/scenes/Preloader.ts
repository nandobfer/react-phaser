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
    }

    create() {
        this.scene.start("Game")
    }

    loadCharacterSpritesheets() {
        const available_sheets = ["rogue", "knight"]

        for (const character_sheet of available_sheets) {
            // always 4 animations, top > left > down > right
            // 7) 0 - 52: spellcasting
            // 8) 53 - 105: thrusting
            // 9) 104 - 158: walking
            this.load.spritesheet(character_sheet, `spritesheets/characters/${character_sheet}.png`, {
                frameWidth: 64,
                frameHeight: 64,
            })
        }
    }
}
