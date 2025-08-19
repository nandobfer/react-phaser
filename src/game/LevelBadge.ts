import Phaser from "phaser"
import { Character } from "./characters/Character"
import { Game } from "./scenes/Game"

type Opts = {
    offsetX?: number
    offsetY?: number
    radius?: number
    bgColor?: number
    borderColor?: number
    textColor?: string
    fontSize?: number
}

export class LevelBadge {
    private scene: Game
    private target: Character
    private circle: Phaser.GameObjects.Graphics
    private text: Phaser.GameObjects.Text
    private offsetX: number
    private offsetY: number
    private radius: number

    constructor(scene: Game, target: Character, opts: Opts = {}) {
        this.scene = scene
        this.target = target

        this.offsetX = opts.offsetX ?? 18
        this.offsetY = opts.offsetY ?? -32
        this.radius = opts.radius ?? 7
        const bg = opts.bgColor ?? 0xffd54f // golden
        const border = opts.borderColor ?? 0x6d4c41
        const color = opts.textColor ?? "#1b1b1b"
        const font = opts.fontSize ?? 10

        this.circle = scene.add.graphics()
        this.circle.fillStyle(bg, 1).lineStyle(1, border, 1).fillCircle(0, 0, this.radius).strokeCircle(0, 0, this.radius)

        this.text = scene.add
            .text(0, 0, "1", {
                fontFamily: "Arial, sans-serif",
                fontSize: `${font}px`,
                color,
            })
            .setOrigin(0.5, 0.58)
            .setShadow(1, 1, "#000", 2, true, true)

        this.setDepth(target.depth + 101)
        this.setVisible(true)
        this.updatePosition()
    }

    setLevel(level: number) {
        this.text.setText(String(level))
    }

    updatePosition() {
        const x = this.target.x + this.offsetX
        const y = this.target.y + this.offsetY
        this.circle.setPosition(x, y)
        this.text.setPosition(x, y)
    }

    setDepth(d: number) {
        this.circle.setDepth(d)
        this.text.setDepth(d + 1)
    }

    setVisible(v: boolean) {
        this.circle.setVisible(v)
        this.text.setVisible(v)
    }

    setAlpha(a: number) {
        this.circle.setAlpha(a)
        this.text.setAlpha(a)
    }

    destroy() {
        this.circle.destroy()
        this.text.destroy()
        // @ts-expect-error help GC
        this.target = undefined
    }

    fadeOut() {
        this.scene.tweens.add({
            targets: { a: 1 },
            a: 0,
            duration: 300,
            onUpdate: (tw, target: any) => {
                this.setAlpha(target.a)
            },
            onComplete: () => {
                this.setVisible(false)
            },
        })
    }

    reset() {
        this.setLevel(this.target.level)
        this.setAlpha(1)
        this.setVisible(true)
    }
}
