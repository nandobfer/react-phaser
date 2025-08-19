import React, { useMemo } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import { Character } from "../../game/characters/Character"
import { ArrowDropDown, Expand } from "@mui/icons-material"

interface CharacterSheetProps {
    character: Character
}

export interface SheetDataItem {
    title: string
    value: number | string
}

export const SheetData: React.FC<SheetDataItem> = (props) => {
    return (
        <Box sx={{ gap: 1 }}>
            <Typography fontWeight={"bold"} variant="subtitle2">
                {props.title}:
            </Typography>
            <Typography variant="subtitle2">{props.value}</Typography>
        </Box>
    )
}

export const CharacterSheet: React.FC<CharacterSheetProps> = (props) => {
    const attributes: SheetDataItem[] = useMemo(
        () => [
            { title: "Health", value: `${props.character.health} / ${props.character.maxHealth}` },
            { title: "Mana", value: `${props.character.mana} / ${props.character.maxMana}` },
            { title: "Attack Damage", value: props.character.attackDamage },
            { title: "Attack Speed", value: `${props.character.attackSpeed} /s` },
            { title: "Crit Chance", value: `${props.character.critChance} %` },
            { title: "Crit Damage Multiplier", value: `x ${props.character.critDamageMultiplier}` },
        ],
        [props.character]
    )
    return (
        <Accordion sx={{ flexDirection: "column" }} slots={{ root: Box }}>
            <AccordionSummary expandIcon={<ArrowDropDown />} sx={{ padding: 0 }}>
                <Typography variant="body1">{props.character.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ flexDirection: "column" }}>
                    {attributes.map((data) => (
                        <SheetData key={data.title} title={data.title} value={data.value} />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}
