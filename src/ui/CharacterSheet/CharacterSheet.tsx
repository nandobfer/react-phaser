import React, { useEffect, useMemo, useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import { Character } from "../../game/characters/Character"
import { ArrowDropDown, Expand } from "@mui/icons-material"
import { EventBus } from "../../game/EventBus"

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
    const [character, setCharacter] = useState(props.character)
    const attributes: SheetDataItem[] = useMemo(
        () => [
            { title: "Health", value: `${character.health} / ${character.maxHealth}` },
            { title: "Mana", value: `${character.mana} / ${character.maxMana}` },
            { title: "Attack Damage", value: character.attackDamage },
            { title: "Attack Speed", value: `${character.attackSpeed} /s` },
            { title: "Crit Chance", value: `${character.critChance} %` },
            { title: "Crit Damage Multiplier", value: `x ${character.critDamageMultiplier}` },
        ],
        [character]
    )

    useEffect(() => {
        EventBus.on(`character-${character.id}-update`, (character: Character) => setCharacter(character))
        return () => {
            EventBus.off(`character-${character.id}-update`, (character: Character) => setCharacter(character))
        }
    }, [])
    return (
        <Accordion sx={{ flexDirection: "column" }} slots={{ root: Box }}>
            <AccordionSummary expandIcon={<ArrowDropDown />} sx={{ padding: 0 }}>
                <Typography variant="body1">{character.name}</Typography>
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
