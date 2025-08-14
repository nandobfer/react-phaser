import React from "react";
import { Box } from "@mui/material";
import Phaser from "phaser";

interface UiProps {
    game: Phaser.Game;
    scene: Phaser.Scene;
}

export const Ui: React.FC<UiProps> = (props) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                bgcolor: "red",
            }}
        ></Box>
    );
};
