import { createTheme } from "@mui/material";
//import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'
import { blueGrey, red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f1c761',
            light: '#f6dc9d',
            dark: '#e0b652'
        },
        secondary: blueGrey,
        error: red,
        custom: {
            light: '#ca2c30',
            main: '#bd2529',
            dark: '#ae1a1e',
            contrastText: '#ffffff',
        },
        background: {
            default: "#fafafa !important"
        }
    },
    typography: {
        fontFamily: ['Mukta', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        //defecto
        body1: {
            fontFamily: [
                'Mukta',
                'sans-serif'
            ].join(','),
            fontSize: '0.9rem',
            '@media (min-width:600px)': {
                fontSize: '1rem',
            }
        },
        body2: {
            fontFamily: [
                'Playfair Display',
                'sans-serif'
            ].join(','),
            fontSize: '0.8rem',
            '@media (min-width:600px)': {
                fontSize: '0.9rem',
            }
        },
    },
})

export default theme;