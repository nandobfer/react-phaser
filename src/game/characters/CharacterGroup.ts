import { Scene } from "phaser"
import { Character } from "./Character"

export class CharacterGroup extends Phaser.GameObjects.Group {
    isPlayer: boolean = false
    constructor(
        scene: Scene,
        children?: Character[] | Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig,
        config?: (Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig) & { isPlayer?: boolean }
    ) {
        super(scene, children, config)
        scene.add.existing(this)
        this.runChildUpdate = true
        this.isPlayer = !!config?.isPlayer
        if (this.isPlayer) {
            this.setChildrenPlayer()
        }
        this.resetMouseEvents()
    }

    override getChildren() {
        return super.getChildren() as Character[]
    }

    add(child: Character, addToScene?: boolean): this {
        super.add(child, addToScene)
        if (this.isPlayer) {
            child.isPlayer = true
            child.resetMouseEvents()
        }

        return this
    }

    private setChildrenPlayer() {
        const characters = this.getChildren() as Character[]
        for (const character of characters) {
            character.isPlayer = true
        }
    }

    private resetMouseEvents() {
        const characters = this.getChildren() as Character[]
        for (const character of characters) {
            character.resetMouseEvents()
        }
    }

    reset() {
        const characters = this.getChildren() as Character[]
        characters.forEach((character) => character.reset())

        const y = this.isPlayer ? 503 : 166

        Phaser.Actions.GridAlign(characters, { cellHeight: 64, cellWidth: 64, y, x: 561 })
    }
}