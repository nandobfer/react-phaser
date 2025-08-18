import { Arrow } from "../objects/Arrow"
import { Game } from "../scenes/Game"
import { Character } from "./Character"

export class Archer extends Character {
    attackSpeed = 0.75
    speed = 40
    attackDamage = 30
    attackRange = 5

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, "archer")
    }

    extractAttackingAnimation() {
        this.extractAnimationsFromSpritesheet("attacking", 208, 13)
    }

    handleAnimationUpdate(_a: Phaser.Animations.Animation, _f: Phaser.Animations.AnimationFrame) {
        /* no-op for Archer */
    }

    private fireArrow() {
        if (!this.target || !this.target.active) return
        const arrow = new Arrow(this)
        arrow.fire()
    }

    handleAttack() {
        if (this.isAttacking || !this.target?.active) {
            return
        }

        this.updateFacingDirection()
        this.isAttacking = true
        const animKey = `${this.name}-attacking-${this.facing}`
        const anim = this.anims.get(animKey)

        const onUpdate = (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (animation.key !== animKey) return
            // Phaser frame indices are 1-based; we want "frame 9"
            if (frame.index === 9) {
                this.fireArrow()
            }
        }

        this.on("animationupdate", onUpdate)

        this.play({ key: animKey, frameRate: anim.frames.length * this.attackSpeed, repeat: 0 }, true)

        const cleanup = () => {
            this.off("animationupdate", onUpdate)
            this.isAttacking = false
        }
        this.once("animationcomplete", cleanup)
        this.once("animationstop", cleanup)
    }
}
