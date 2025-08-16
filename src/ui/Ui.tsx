import React from "react";
import { Box } from "@mui/material";
import Phaser from "phaser";
import { CharactersRow } from "./CharactersRow";
import { Game } from "../game/scenes/Game";

interface UiProps {
    game?: Phaser.Game | null
    scene?: Phaser.Scene | Game | null
}

export const Ui: React.FC<UiProps> = (props) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 5,
                border: "1px solid red",
                pointerEvents: "none",
            }}
        >
            {props.scene instanceof Game && <CharactersRow charactersGroup={props.scene.characters} />}
        </Box>
    )
}

