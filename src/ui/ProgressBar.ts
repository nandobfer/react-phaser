// src/ui/HealthBar.ts
import Phaser from "phaser"
import { Character } from "../game/characters/Character"
import { Game } from "../game/scenes/Game"

export interface BarOptions {
    color: number
    offsetY: number
    interpolateColor?: boolean
}

export class ProgressBar {
    private scene: Game
    private target: Character
    private bg: Phaser.GameObjects.Graphics
    private bar: Phaser.GameObjects.Graphics
    private width: number
    private height: number
    private offsetY: number
    private showWhenFull: boolean
    private borderColor: number
    private borderWidth: number
    private bgColor: number
    private fillColor: number
    private interpolateColor: boolean

    constructor(target: Character, options: BarOptions) {
        this.target = target
        this.scene = this.target.scene

        this.width = 30
        this.height = 4
        this.offsetY = options.offsetY
        this.showWhenFull = false
        this.borderColor = 0x000000
        this.borderWidth = 1
        this.bgColor = 0x222222
        this.fillColor = options.color
        this.interpolateColor = !!options.interpolateColor

        this.bg = this.scene.add.graphics({ x: 0, y: 0 }).setDepth(target.depth + 100)
        this.bar = this.scene.add.graphics({ x: 0, y: 0 }).setDepth(target.depth + 101)

        this.setVisible(false)
        this.updatePosition()
    }

    updatePosition(): void {
        const x = this.target.x - this.width / 2
        const y = this.target.y + this.offsetY
        this.bg.setPosition(x, y)
        this.bar.setPosition(x, y)
    }

    setDepth(d: number): void {
        this.bg.setDepth(d)
        this.bar.setDepth(d + 1)
    }

    setVisible(v: boolean): void {
        this.bg.setVisible(v)
        this.bar.setVisible(v)
    }

    setAlpha(a: number): void {
        this.bg.setAlpha(a)
        this.bar.setAlpha(a)
    }

    setValue(current: number, max: number): void {
        const ratio = Phaser.Math.Clamp(max > 0 ? current / max : 0, 0, 1)
        // Hide at full HP if desired
        // const shouldShow = this.showWhenFull ? true : ratio < 1
        this.setVisible(this.target.active)
        let fillColor = this.fillColor

        if (this.interpolateColor) {
            // Color shift (green -> yellow -> red)
            const fill = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(0xe74c3c), // red
                Phaser.Display.Color.ValueToColor(this.fillColor), // green
                100,
                Math.floor(ratio * 100)
            )
            fillColor = Phaser.Display.Color.GetColor(fill.r, fill.g, fill.b)
        }

        // Redraw
        this.bg.clear()
        this.bg.lineStyle(this.borderWidth, this.borderColor, 1)
        this.bg.fillStyle(this.bgColor, 1)
        this.bg.fillRect(0, 0, this.width, this.height)
        this.bg.strokeRect(0, 0, this.width, this.height)

        this.bar.clear()
        this.bar.fillStyle(fillColor, 1)
        this.bar.fillRect(0, 0, Math.max(0, Math.floor(this.width * ratio)), this.height)
    }

    reset(maxValue: number) {
        this.setAlpha(1)
        this.setValue(maxValue, maxValue)
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

    destroy(): void {
        this.bg.destroy()
        this.bar.destroy()
        // @ts-expect-error – help GC
        this.target = undefined
        // @ts-expect-error – help GC
        this.scene = undefined
    }
}
