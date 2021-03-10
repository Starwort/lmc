import { Button, Card, CardActions, FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';
import MailBox from './MailBox';
import MiscValueDialogue from './MiscValueDialogue';
import './PostOffice.scss';

interface PostOfficeProps {
    mailBoxValues: number[],
    inputActive: boolean,
    accumulator: number,
    setAccumulator: (value: number) => void,
    setPC: (value: number) => void,
    pc: number,
    running: boolean,
    setRunning: (value: boolean) => void,
    instant: boolean,
    setInstant: (value: boolean) => void,
    setMailBox: (mailbox: number, value: number) => void,
    step: () => void,
    doneAwaiting: () => void,
}

function PostOffice(props: PostOfficeProps) {
    const [accOpen, setAccOpen] = React.useState(false);
    const [pcOpen, setPcOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [detailedErrorText, setDetailedErrorText] = React.useState('');
    const [newAcc, setNewAcc] = React.useState(0);
    return <Card style={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 8,
        padding: 8,
    }}>
        {[...Array(10)].map((_, y) =>
            <div className="row">
                {[...Array(10)].map((_, x) =>
                    <MailBox
                        value={props.mailBoxValues[y * 10 + x]}
                        index={y * 10 + x}
                        active={props.pc === (y * 10 + x)}
                        setMailBox={props.setMailBox}
                    />
                )}
            </div>
        )}
        <div className="hud">
            <div className="acc">
                Accumulator: <MailBox
                    value={props.accumulator}
                    setDialogueOpen={setAccOpen}
                    dialogue={
                        <MiscValueDialogue
                            setValue={props.setAccumulator}
                            open={accOpen}
                            setOpen={setAccOpen}
                            name="Accumulator"
                        />
                    }
                />
            </div>
            <div className="pc">
                Program Counter: <MailBox
                    value={props.pc}
                    setDialogueOpen={setPcOpen}
                    hideSign
                    pad={2}
                    dialogue={
                        <MiscValueDialogue
                            setValue={props.setPC}
                            open={pcOpen}
                            setOpen={setPcOpen}
                            name="Program Counter"
                        />
                    }
                />
            </div>
            <div className="ir">
                Instruction Register: <MailBox
                    value={Math.trunc(props.mailBoxValues[props.pc] / 100)}
                    hideSign
                    noDialogue
                    pad={1}
                />
            </div>
            <div className="ar">
                Address Register: <MailBox
                    value={props.mailBoxValues[props.pc] % 100}
                    hideSign
                    noDialogue
                    pad={2}
                />
            </div>
            <div className="input-field">
                <TextField
                    variant="filled"
                    fullWidth
                    type="number"
                    label="Input value"
                    disabled={!props.inputActive}
                    error={detailedErrorText ? true : error}
                    helperText={
                        detailedErrorText ? detailedErrorText : "Must be an integer from -999 to 999"
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        let newAcc = event.target.valueAsNumber;
                        if (isNaN(newAcc) || newAcc % 1 !== 0) {
                            setDetailedErrorText("Must be an integer");
                            return;
                        } else {
                            setDetailedErrorText('');
                        }
                        if (newAcc < -999 || newAcc > 999) {
                            setError(true);
                            return;
                        } else {
                            setError(false);
                        }
                        setNewAcc(newAcc);
                    }}
                    onKeyPress={(ev: React.KeyboardEvent<HTMLDivElement>) => {
                        if (ev.key === 'Enter') {
                            if (!error) {
                                console.log('setting:', newAcc);
                                props.setAccumulator(newAcc);
                                props.doneAwaiting();
                            }
                            ev.preventDefault();
                        }
                    }}
                >
                </TextField>
            </div>
        </div>
        <CardActions>
            <Button
                variant="text"
                color="primary"
                onClick={props.step}
                disabled={props.running}
            >Step</Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => props.setRunning(!props.running)}
            >{props.running ? "Stop" : "Run"}</Button>

            <FormControlLabel
                style={{ marginRight: 0 }}
                control={<Switch
                    color="primary"
                    checked={props.instant}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        props.setInstant(event.target.checked);
                    }}
                />}
                label="Run code as fast as possible"
            />
        </CardActions>
    </Card>
}

export default PostOffice;
