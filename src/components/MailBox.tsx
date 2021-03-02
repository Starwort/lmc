import { Card, CardActionArea, CardContent } from '@material-ui/core';
import assert from 'assert';
import React from 'react';
import theme from '../dark';
import MailBoxValueDialogue from './MailBoxValueDialogue';

interface MailBoxProps {
    value: number,
    index?: number,
    pad?: number,
    hideSign?: boolean,
    active?: boolean,
    disabled?: boolean,
    dialogue?: React.ReactNode,
    noDialogue?: boolean,
    setDialogueOpen?: (value: boolean) => void,
    setMailBox?: (index: number, value: number) => void,
}

function MailBox(props: MailBoxProps) {
    const [open, setOpen] = React.useState(false);
    let dialogue = props.dialogue;
    if (!props.dialogue && !props.noDialogue) {
        assert(props.index !== undefined);
        assert(props.setMailBox !== undefined);
        dialogue = <MailBoxValueDialogue
            open={open}
            setOpen={setOpen}
            setMailBox={props.setMailBox}
            index={props.index}
        />
    }
    let setDialogueOpen = props.setDialogueOpen ?? setOpen;
    return <>
        <Card
            style={
                props.active
                    ? {
                        margin: 4,
                        color: theme.palette.primary.contrastText,
                        backgroundColor: theme.palette.primary.main,
                    }
                    : {
                        margin: 4
                    }
            }
            variant="outlined"
        >
            <CardActionArea onClick={() => setDialogueOpen(true)}>
                <CardContent style={{
                    padding: 8,
                    fontFamily: '"Source Code Pro", "Courier New", Courier, monospace'
                }}>
                    {
                        (props.hideSign ? '' : (props.value < 0 ? '-' : '+'))
                        + Math.abs(props.value)
                            .toString()
                            .padStart(
                                (props.pad ?? 3),
                                '0'
                            )
                    }
                </CardContent>
            </CardActionArea>
        </Card>
        {props.noDialogue ? null : dialogue}
    </>;
}

export default MailBox;
