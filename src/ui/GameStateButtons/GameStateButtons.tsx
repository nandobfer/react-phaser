import React from "react"
import { Box, Button } from "@mui/material"
import { Game } from "../../game/scenes/Game"

interface GameStateButtonsProps {
    game: Game
}

export const GameStateButtons: React.FC<GameStateButtonsProps> = (props) => {
    const onResetClick = () => {
        props.game.playerTeam.reset()
        props.game.enemyTeam.reset()
    }

    const onPlayClick = () => {
        props.game.changeState('fighting')
    }

    return (
        <Box sx={{ pointerEvents: "auto", flexDirection: "column", gap: 1 }}>
            <Button variant="outlined" onClick={onResetClick}>
                reset
            </Button>
            <Button variant="outlined" onClick={onPlayClick}>
                fight
            </Button>
        </Box>
    )
}
