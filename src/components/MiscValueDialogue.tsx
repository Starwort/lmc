import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React from 'react';

interface MiscValueDialogueProps {
    setValue: (value: number) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
    name: string,
}

function MiscValueDialogue(props: MiscValueDialogueProps) {
    const handleClose = () => {
        props.setOpen(false);
    };
    let newValue = 0;
    const [error, setError] = React.useState(false);
    const [detailedErrorText, setDetailedErrorText] = React.useState('');
    function validate(event: React.ChangeEvent<HTMLInputElement>) {
        newValue = event.target.valueAsNumber;
        if (isNaN(newValue) || newValue % 1 !== 0) {
            setDetailedErrorText("Must be an integer");
            return;
        } else {
            setDetailedErrorText('');
        }
        if (newValue < -999 || newValue > 999) {
            setError(true);
        } else {
            setError(false);
        }
    }

    return <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Set value of {props.name}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter the new value for the {props.name}
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="New value"
                variant="filled"
                type="number"
                error={detailedErrorText ? true : error}
                helperText={
                    detailedErrorText ? detailedErrorText : "Must be an integer from -999 to 999"
                }
                onChange={validate}
                fullWidth
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button
                onClick={
                    () => {
                        props.setValue(newValue);
                        handleClose();
                    }
                }
                disabled={error}
                variant="contained"
                color="primary"
            >
                Update
            </Button>
        </DialogActions>
    </Dialog>;
}
export default MiscValueDialogue;