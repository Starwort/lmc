import { Button, Card, CardActions, CardContent, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import theme from '../dark';
import './App.scss';
import CodePanel from './CodePanel';
import PostOffice from './PostOffice';

function divmod(x: number, y: number) {
    var div = Math.trunc(x / y);
    var rem = x % y;
    return [div, rem];
}
declare global {
    interface Window {
        awaitingInput: boolean,
        pc: number,
        mailBoxes: number[],
        acc: number,
        output: string,
        instant: boolean,
        running: boolean,
        timeoutID: number | undefined,
    }
}

function App() {
    let initialMailBoxes = [];
    for (var i = 0; i < 100; i++) {
        initialMailBoxes.push(0);
    }
    const [mailBoxes, setMailBoxes] = React.useState(initialMailBoxes);
    window.mailBoxes = mailBoxes;
    const [running, setRunningImpl] = React.useState(false);
    window.running = running;
    const [acc, setAcc] = React.useState(0)
    window.acc = acc;
    const [output, setOutput] = React.useState('');
    window.output = output;
    const [awaitingInput, setAwaitingInput] = React.useState(false);
    window.awaitingInput = awaitingInput;
    const [instant, setInstantImpl] = React.useState(false);
    window.instant = instant;
    function setMailBox(mailbox: number, value: number) {
        let newMailBoxes = [...mailBoxes];
        newMailBoxes[mailbox] = value;
        setMailBoxes(newMailBoxes);
    }
    const [pc, setPC] = React.useState(0);
    window.pc = pc;
    function step() {
        if (window.awaitingInput) {
            return;
        }
        if (!window.running) {
            window.clearInterval(window.timeoutID);
            return;
        }
        let instruction = window.mailBoxes[window.pc];
        console.log('stepping:', instruction);
        if (window.pc < 99) {
            window.pc++;
            setPC(window.pc);
        }
        if (instruction < 0) {
            setOutput(
                output
                + '\nError: Attempted to execute an invalid opcode\n'
            );
            setRunning(false);
            return;
        }
        let [opc, arg] = divmod(instruction, 100);
        switch (opc) {
            case 0:
                setRunning(false);
                return;
            case 1:
                window.acc = window.acc + window.mailBoxes[arg];
                setAcc(window.acc);
                break;
            case 2:
                window.acc = window.acc - window.mailBoxes[arg];
                setAcc(window.acc);
                break;
            case 3:
                window.mailBoxes[arg] = window.acc;
                break;
            case 5:
                window.acc = window.mailBoxes[arg];
                setAcc(window.mailBoxes[arg]);
                break;
            case 6:
                window.pc = arg;
                setPC(arg);
                break;
            case 7:
                if (window.acc === 0) {
                    window.pc = arg;
                    setPC(arg);
                }
                break;
            case 8:
                if (window.acc >= 0) {
                    window.pc = arg;
                    setPC(arg);
                }
                break;
            case 9:
                switch (arg) {
                    case 1:
                        window.awaitingInput = true;
                        setAwaitingInput(true);
                        break;
                    case 2:
                        setOutput(window.output + window.acc.toString() + '\n');
                        break;
                    case 22:
                        setOutput(window.output + String.fromCharCode(window.acc));
                        break;
                    default:
                        setOutput(
                            window.output
                            + '\nError: Attempted to execute an invalid opcode\n'
                        );
                        setRunning(false);
                }
                break;
            default:
                setOutput(
                    window.output
                    + '\nError: Attempted to execute an invalid opcode\n'
                );
                setRunning(false);
        }
    }
    function setInstant(value: boolean) {
        window.instant = value;
        setInstantImpl(value);
        if (window.timeoutID) {
            window.clearInterval(window.timeoutID);
            window.timeoutID = window.setInterval(step, window.instant ? 0 : 2000);
        }
    }
    function setRunning(value: boolean) {
        window.running = value;
        setRunningImpl(value);
        if (window.timeoutID) {
            window.clearInterval(window.timeoutID);
            window.timeoutID = undefined;
        }
        if (value) {
            // if (instant) {
            //     step();
            // } else {
            //     window.timeoutID = window.setInterval(step, 500);
            // }
            window.timeoutID = window.setInterval(step, window.instant ? 0 : 2000);
        }
    }
    function doneAwaiting() {
        window.awaitingInput = false;
        setAwaitingInput(false);
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="row" style={{
                alignItems: 'flex-start'
            }}>
                <CodePanel
                    disabled={running}
                    setMailBoxes={setMailBoxes}
                    setAccumulator={setAcc}
                    setPC={setPC}
                />
                <Card style={{ marginTop: 8, width: 300 }}>
                    <CardContent>
                        Output:
                        <div className="output">
                            {output}
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => setOutput('')}>
                            Clear output
                        </Button>
                    </CardActions>
                </Card>
                <PostOffice
                    mailBoxValues={mailBoxes}
                    accumulator={acc}
                    inputActive={window.awaitingInput}
                    setAccumulator={setAcc}
                    doneAwaiting={doneAwaiting}
                    running={running}
                    setRunning={setRunning}
                    instant={instant}
                    setInstant={setInstant}
                    setMailBox={setMailBox}
                    step={step}
                    setPC={setPC}
                    pc={pc}
                />
            </div>
        </ThemeProvider>
    );
}

export default App;
