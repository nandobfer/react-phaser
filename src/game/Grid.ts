// src/game/grid/Grid.ts
import Phaser from "phaser"
import { Game } from "./scenes/Game"

type Insets = { left: number; right: number; top: number; bottom: number }
type GridOpts = {
    cell?: number
    insets?: Partial<Insets> // to exclude arena borders if needed
    depthOverArena?: number // highlight depth relative to arena
}

export class Grid {
    private scene: Game
    private arena: Phaser.GameObjects.Image
    private left!: number
    private top!: number
    private width!: number
    private height!: number
    cellW!: number
    cellH!: number
    cols!: number
    rows!: number
    private hi!: Phaser.GameObjects.Rectangle
    private insets: Insets
    private depthOverArena: number

    constructor(scene: Game, arena: Phaser.GameObjects.Image) {
        this.scene = scene
        this.arena = arena

        this.insets = { left: 130, right: 132, top: 160, bottom: 122 }
        this.depthOverArena = 1

        // set geometry
        const b = arena.getBounds() // world-space rect accounting for scale/pos
        const innerW = arena.displayWidth - this.insets.left - this.insets.right
        const innerH = arena.displayHeight - this.insets.top - this.insets.bottom
        this.width = innerW
        this.height = innerH
        this.left = b.left + this.insets.left
        this.top = b.top + this.insets.top

        // derive cols/rows from desired cell
        const cell = Math.max(1, 64)
        this.cols = Math.max(1, Math.floor(innerW / cell))
        this.rows = Math.max(1, Math.floor(innerH / cell))

        // make cells fill the inner rect exactly
        this.cellW = innerW / this.cols
        this.cellH = innerH / this.rows

        // highlight rectangle
        this.hi = scene.add
            .rectangle(0, 0, this.cellW, this.cellH)
            .setStrokeStyle(2, 0xffe066, 0.95)
            .setFillStyle(0xfff6a0, 0.15)
            .setVisible(false)
            .setDepth(arena.depth + this.depthOverArena)
    }

    worldToCell(wx: number, wy: number) {
        const col = Math.floor((wx - this.left) / this.cellW)
        const row = Math.floor((wy - this.top) / this.cellH)
        if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return null
        return { col, row }
    }

    cellToCenter(col: number, row: number) {
        const x = this.left + (col + 0.5) * this.cellW
        const y = this.top + (row + 0.5) * this.cellH
        return { x, y }
    }

    showHighlightAtWorld(wx: number, wy: number) {
        const cell = this.worldToCell(wx, wy)
        if (!cell) {
            this.hi.setVisible(false)
            return null
        }
        const { x, y } = this.cellToCenter(cell.col, cell.row)
        this.hi.setPosition(x, y).setDisplaySize(this.cellW, this.cellH).setVisible(true)
        return cell
    }

    hideHighlight() {
        this.hi.setVisible(false)
    }

    snapSpriteToWorld(sprite: Phaser.GameObjects.Sprite, wx: number, wy: number) {
        const cell = this.worldToCell(wx, wy)
        if (!cell) return false
        const { x, y } = this.cellToCenter(cell.col, cell.row)
        sprite.setPosition(x, y)
        const body = sprite.body as Phaser.Physics.Arcade.Body | undefined
        body?.reset(x, y) // keep physics body in sync
        return true
    }
}
