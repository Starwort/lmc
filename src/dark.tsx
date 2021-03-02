import { createMuiTheme } from '@material-ui/core/styles';

// Dark theme
const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#bb86fc',
            dark: '#C191FC',
            // dark: '#3700b3',
            contrastText: '#000000',
        },
        secondary: {
            main: '#03dac6',
            dark: '#03dac6',
            contrastText: '#000000',
        },
        error: {
            main: '#cf6679',
        },
        background: {
            paper: '#1e1e1e',
            default: '#121212'
        },
        text: {
            primary: 'rgba(255,255,255,87%)',
            secondary: 'rgba(255,255,255,60%)',
            hint: 'rgba(255,255,255,60%)',
            disabled: 'rgba(255,255,255,38%)',
        }
    },
    zIndex: {
        appBar: 1250
    },
});

theme.overrides = {
    MuiAppBar: {
        colorPrimary: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
        },
        colorSecondary: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.secondary.main,
        },
        colorDefault: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        }
    },
    MuiDrawer: {
        paper: {
            width: 240
        }
    },
    MuiListItemIcon: {
        root: {
            color: theme.palette.text.primary,
        }
    }
};

export default theme;