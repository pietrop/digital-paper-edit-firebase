import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { blue, indigo, green, purple } from '@material-ui/core/colors';

import 'fontsource-roboto';
const darkBlueColor = '#084177';
const darkRedColor = '#b2102f';
const bootstrapBlue = '#007bff';
const bootstrapRed = '#dc3545';
const navyBlue = '#023E8A';
const customBlue = '#1769aa';
const theme = createMuiTheme({
  palette: {
    background: {
      // paper: '#424242',
      // default: '#303030',
      // paper: '#fff',
      // default: '#fafafa',
    },
    primary: {
      main: navyBlue,
    },
    secondary: {
      main: darkRedColor,
    },
  },
});

ReactDOM.render(
  <>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
