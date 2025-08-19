import Phaser from "phaser"
import { Game } from "../scenes/Game"

export type DamageTextOpts = {
    crit?: boolean
    color?: string
    duration?: number
    float?: number
    depth?: number
}

const pool = new WeakMap<Phaser.Scene, Phaser.GameObjects.Text[]>()

function getText(scene: Game) {
    const p = pool.get(scene) ?? (pool.set(scene, []), pool.get(scene)!)
    return (
        p.pop() ??
        scene.add
            .text(0, 0, "", {
                fontFamily: "Arial Black, Arial, sans-serif",
                fontSize: "18px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5)
    )
}

function release(scene: Game, t: Phaser.GameObjects.Text) {
    t.setVisible(false)
    const p = pool.get(scene)!
    p.push(t)
}

export function showDamageText(scene: Game, x: number, y: number, value: number | string, opts: DamageTextOpts = {}) {
    const txt = getText(scene)

    const crit = !!opts.crit
    const color = opts.color ?? (crit ? "#ffea00" : "#ffffff")
    const duration = opts.duration ?? (crit ? 550 : 420)
    const float = opts.float ?? (crit ? 40 : 28)
    const depth = opts.depth ?? 10_000

    txt.setText(String(value))
        .setPosition(x + Phaser.Math.Between(-4, 4), y - 18)
        .setScale(crit ? 1.1 : 0.95)
        .setAlpha(1)
        .setColor(color)
        .setDepth(depth)
        .setVisible(true)

    // tiny pop for crits
    if (crit) {
        scene.tweens.add({ targets: txt, scale: 1.25, duration: 80, yoyo: true, ease: "Back.Out" })
    }

    scene.tweens.add({
        targets: txt,
        y: txt.y - float,
        alpha: 0,
        duration,
        ease: "Cubic.Out",
        onComplete: () => release(scene, txt),
    })
}
