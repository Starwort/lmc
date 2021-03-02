import { Button, Card, CardActions, CardContent, FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';
import { allMnemonics, noArgMnemonics, oneArgMnemonics } from '../lmc';
import './CodePanel.scss';

const tabStop = '        ';

interface IDictionary<TValue> {
    [key: string]: TValue;
}

interface CodePanelProps {
    setMailBoxes: (values: number[]) => void,
    setAccumulator: (value: number) => void,
    setPC: (value: number) => void,
    autoFormatCode?: boolean,
    disabled: boolean,
}
interface CodePanelState {
    code: string,
    errorText: string,
    autoFormat: boolean,
}
function splitWithTail(str: string, delim: string, count: number) {
    var parts = str.split(delim);
    var tail = parts.slice(count).join(delim);
    var result = parts.slice(0, count);
    result.push(tail);
    return result;
}

class CodePanel extends React.Component<CodePanelProps, CodePanelState> {
    state: CodePanelState
    errorText: string
    code: string
    constructor(props: CodePanelProps) {
        super(props);
        this.errorText = '';
        this.state = { code: this.code = '', errorText: '', autoFormat: props.autoFormatCode ?? true };
        this.codeChanged = this.codeChanged.bind(this);
        this.changeAutoFormatState = this.changeAutoFormatState.bind(this);
        this.assemble = this.assemble.bind(this);
    }
    format(code: string): string {
        console.log('Formatting code:');
        console.log(code);
        var lines = code.split('\n');
        let errors = [];
        let labels: IDictionary<number> = {};
        let labelsUsed: IDictionary<string> = {};
        let n_lines = 0;
        for (var i = 0; i < lines.length; i++) {
            let orig_line = lines[i];
            let [line, comment] = splitWithTail(orig_line, '//', 2);
            comment = comment.trim();
            if (comment || orig_line.endsWith('//')) {
                comment = '// ' + comment;
            }
            line = line.replace(/ +/g, ' ').trim();
            let parts = line.split(' ');
            let label = '', mnemonic = '', argument = '';
            switch (parts.length) {
                case 0:
                    break;
                case 1:
                    mnemonic = parts[0];
                    if (mnemonic === '') {
                        break;
                    }
                    if (!(mnemonic.toUpperCase() in noArgMnemonics)) {
                        if (mnemonic.toUpperCase() in oneArgMnemonics) {
                            errors.push(`Line ${i + 1}: '${mnemonic.toUpperCase()}' requires a mailbox`);
                        } else {
                            errors.push(`Line ${i + 1}: invalid mnemonic '${mnemonic.toUpperCase()}'`);
                            [label, mnemonic] = [mnemonic, ''];
                        }
                    }
                    break;
                case 2:
                    let [a, b] = parts;
                    if (allMnemonics.includes(a.toUpperCase())) {
                        [mnemonic, argument] = [a, b];
                        if (!(mnemonic.toUpperCase() in oneArgMnemonics)) {
                            errors.push(`Line ${i + 1}: '${mnemonic.toUpperCase()}' does not take a mailbox`);
                        }
                    } else {
                        [label, mnemonic] = [a, b];
                        if (!allMnemonics.includes(mnemonic.toUpperCase())) {
                            errors.push(`Line ${i + 1}: invalid mnemonic '${mnemonic.toUpperCase()}'`);
                        } else if (!(mnemonic.toUpperCase() in noArgMnemonics)) {
                            errors.push(`Line ${i + 1}: '${mnemonic.toUpperCase()}' requires a mailbox`);
                        }
                    }
                    break;
                case 3:
                    [label, mnemonic, argument] = parts;
                    if (!allMnemonics.includes(mnemonic.toUpperCase())) {
                        errors.push(`Line ${i + 1}: invalid mnemonic '${mnemonic.toUpperCase()}'`);
                    } else if (!(mnemonic.toUpperCase() in oneArgMnemonics)) {
                        errors.push(`Line ${i + 1}: '${mnemonic.toUpperCase()}' does not take a mailbox`);
                    }
                    break;
                default:
                    [label, mnemonic, argument] = parts.slice(0, 3);
                    comment = '// ' + parts.slice(3).join(' ');
                    errors.push(`Line ${i + 1}: Too many parts`)
            }
            if (label) {
                labels[label] = i;
            }
            if (argument && !/^\d+$/.test(argument)) {
                labelsUsed[i + 1] = argument;
            }
            let formattedLine = label;
            if (mnemonic || orig_line.endsWith(' ')) {
                formattedLine += ' ' + tabStop.slice(label.length + 1) + mnemonic.toUpperCase();
            }
            if (mnemonic) {
                if (mnemonic.toUpperCase() in oneArgMnemonics) {
                    formattedLine += ' ' + tabStop.slice(mnemonic.length + 1) + argument;
                }
                n_lines++;
            }
            if (comment || orig_line.endsWith('//')) {
                if (label || mnemonic || argument) {
                    formattedLine += '  '
                }
                formattedLine += comment;
            }

            if (this.state.autoFormat) {
                lines[i] = formattedLine;
            }
        }
        for (let [line, label] of Object.entries(labelsUsed)) {
            if (!(label in labels)) {
                errors.push(`Line ${line}: Undefined label ${label}`);
            }
        }
        if (n_lines > 100) {
            errors.push(
                `Too many instructions: Got ${n_lines} but only have 100 mailboxes`
            );
        }
        this.errorText = errors[0] || ''; // .join('\n');
        if (errors.length > 1) {
            this.errorText = `${errors.length} errors: ` + this.errorText;
        }
        console.log('Errors:', this.errorText);
        return lines.join('\n');
    }
    assemble(code: string) {
        if (this.errorText) {
            return;
        }
        this.props.setAccumulator(0);
        this.props.setPC(0);
        let mailBoxes = [];
        let instructions = [];
        let labels: IDictionary<number> = {};
        for (let line of code.split('\n')) {
            [line] = line.split('//', 1);
            line += ' ';
            line = line.replace(/ +/g, ' ');
            if (line === ' ') {
                continue;
            }
            let [label, mnemonic, argument] = line.split(' ')
            if (label) {
                labels[label] = instructions.length;
            }
            instructions.push([mnemonic, argument]);
        }
        for (let [mnemonic, argument] of instructions) {
            if (/^\d+$/.test(argument)) {
                mailBoxes.push(
                    oneArgMnemonics[
                    mnemonic as keyof typeof oneArgMnemonics
                    ]
                    + (+argument)
                );
            } else if (argument) {
                mailBoxes.push(
                    oneArgMnemonics[
                    mnemonic as keyof typeof oneArgMnemonics
                    ]
                    + labels[argument]
                );
            } else {
                mailBoxes.push(
                    noArgMnemonics[
                    mnemonic as keyof typeof noArgMnemonics
                    ]
                );
            }
        }
        for (let i = mailBoxes.length; i < 100; i++) {
            mailBoxes.push(0);
        }
        this.props.setMailBoxes(mailBoxes);
    }
    codeChanged(event: React.ChangeEvent<HTMLInputElement>) {
        var newState = {
            code: this.code = this.format(event.target.value),
            errorText: '',
            autoFormat: this.state.autoFormat
        };
        newState.errorText = this.errorText;
        if (!this.errorText) {
            this.assemble(newState.code);
        }
        this.setState(newState);
    }
    changeAutoFormatState(event: React.ChangeEvent<HTMLInputElement>) {
        let code = event.target.checked ? this.format(this.state.code) : this.state.code;
        this.setState({
            code: code,
            errorText: this.errorText,
            autoFormat: event.target.checked,
        })
    }
    render() {
        return <Card style={{ margin: 8 }}>
            <CardContent style={{
                paddingBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
            }}>
                <TextField
                    multiline
                    id="code"
                    variant="filled"
                    label="Code"
                    rows={24}
                    fullWidth={true}
                    value={this.state.code}
                    error={this.state.errorText !== ''}
                    helperText={this.state.errorText}
                    className="code-panel"
                    onChange={this.codeChanged}
                    disabled={this.props.disabled}
                />
                <FormControlLabel
                    style={{ marginRight: 0 }}
                    control={<Switch
                        color="primary"
                        checked={this.state.autoFormat}
                        onChange={this.changeAutoFormatState}
                    />}
                    label="Automatically Format Code"
                />
            </CardContent>
            <CardActions>
                <Button
                    onClick={() => this.assemble(this.code)}
                >Reassemble</Button>
            </CardActions>
        </Card>;
    }
}

export default CodePanel;
