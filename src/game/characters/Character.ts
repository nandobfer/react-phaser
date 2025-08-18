import Phaser, { Scene } from "phaser"
import { Game } from "../scenes/Game"

export type Direction = "left" | "up" | "down" | "right"

export class CharacterGroup extends Phaser.GameObjects.Group {
    constructor(
        scene: Scene,
        children?: Character[] | Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig,
        config?: Phaser.Types.GameObjects.Group.GroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig
    ) {
        super(scene, children, config)
    }
}

export class Character extends Phaser.Physics.Arcade.Sprite {
    facing: Direction = "down"
    target?: Character
    speed = 30
    moving: boolean = true
    attacking: boolean = false

    declare scene: Game

    private glowFx: Phaser.FX.Glow

    constructor(scene: Game, x: number, y: number, name: string) {
        super(scene, x, y, name)

        this.name = name
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.setCollideWorldBounds(true)

        this.createAnimations()
        this.handleMouseEvents()

        this.glowFx = this.postFX.addGlow(0xffffff, 8, 0) // White glow
        this.glowFx.outerStrength = 0

        this.anims.play(`${this.name}-idle-down`)
    }

    createAnimations() {
        // walking
        this.extractAnimationsFromSpritesheet("walking", 104, 9)

        // idle
        this.extractAnimationsFromSpritesheet("idle", 286, 2)
    }

    extractAnimationsFromSpritesheet(key: string, startingFrame: number, framesPerRow: number) {
        const directions: Direction[] = ["up", "left", "down", "right"]
        let currentFrameCount = startingFrame
        const offsetFrames = 13 - framesPerRow

        for (const direction of directions) {
            this.anims.create({
                key: `${this.name}-${key}-${direction}`,
                frames: this.anims.generateFrameNumbers(this.name, { start: currentFrameCount, end: currentFrameCount + framesPerRow - 1 }),
                frameRate: framesPerRow + 1,
                repeat: -1,
            })
            currentFrameCount += framesPerRow + offsetFrames
        }
    }

    handleMouseEvents() {
        this.setInteractive({ useHandCursor: true, draggable: true })
        this.scene.input.setDraggable(this)

        this.scene.input.enableDebug(this)

        this.on("pointerover", () => {
            // this.setTint(0xffffff) // Visual feedback
            // this.glowFx = this.postFX.addGlow(0xffffff, 0, 0) // (color, distance, quality, hide)
            this.animateGlow(5)
        })

        this.on("pointerout", () => {
            // this.clearTint()
            // if (this.glowFx) {
            //     this.postFX.remove(this.glowFx)
            // }
            this.animateGlow(0)
        })

        this.on("drag", (_: never, x: number, y: number) => {
            this.setPosition(x, y)
        })
    }

    private animateGlow(targetStrength: number) {
        if (!this.glowFx) return

        this.scene.tweens.add({
            targets: this.glowFx,
            outerStrength: targetStrength,
            duration: 250, // Animation duration (ms)
            ease: "Sine.easeOut", // Smooth easing
        })
    }

    newTarget(enemies: Character[]) {
        let closestEnemy: Character | undefined = undefined
        let closestEnemyDistance = 0
        for (const enemy of enemies) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
            if (!closestEnemy) {
                closestEnemy = enemy
                closestEnemyDistance = distance
                continue
            }

            if (distance < closestEnemyDistance) {
                closestEnemy = enemy
                closestEnemyDistance = distance
            }
        }

        this.target = closestEnemy
    }

    idle() {
        this.play(`${this.name}-idle-${this.facing}`, true)
    }

    stopMoving() {
        this.moving = false
        this.setVelocity(0, 0)
    }

    moveToTarget() {
        if (!this.target || !this.target.active) {
            this.target = undefined
            this.idle()
            return
        }

        // const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
        // console.log(distance)

        // Calculate direction vector
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)

        // Set velocity based on direction
        this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), this.speed, this.body?.velocity)

        // Update facing direction based on movement
        this.updateFacingDirection()

        // Play appropriate walking animation
        this.play(`${this.name}-walking-${this.facing}`, true)
    }

    private updateFacingDirection() {
        if (!this.body) return
        const { velocity } = this.body

        // Determine primary direction based on velocity
        if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
            this.facing = velocity.x > 0 ? "right" : "left"
        } else {
            this.facing = velocity.y > 0 ? "down" : "up"
        }
    }

    handleCollisionWithEnemy() {
        if (!this.target) return

        this.stopMoving()
        this.idle()
    }

    isColliding() {
        // not working
        return this.scene.physics.world.collide(this, this.target)
    }

    startMoving() {
        this.moving = true
    }

    update(time: number, delta: number): void {
        if (this.target) {
            if (this.moving) {
                this.moveToTarget()
            } else {
                if (this.isColliding()) {
                    // attack
                } else {
                    // this.startMoving()
                }
            }
        } else {
            const enemyTeam = this.scene.characters.contains(this) ? this.scene.enemies : this.scene.characters
            const enemies = enemyTeam.getChildren() as Character[]
            this.newTarget(enemies)
        }
    }
}
