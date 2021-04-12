import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomAlert from './Components/lib/CustomAlert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

import CustomNavbar from './CustomNavbar';
import firebase from './Firebase.js';
import useOnlineStatus from './Components/lib/useOnlineStatus';

import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import WbSunnyIcon from '@material-ui/icons/WbSunny';

// const Projects = lazy(() => import('./Components/Projects/index.js'));
// const Project = lazy(() => import('./Components/Projects/Project.js'));
// const TranscriptCorrect = lazy(() => import('./Components/Transcripts/TranscriptCorrect.js'));
// const PaperEdit = lazy(() => import('./Components/PaperEdits/PaperEdit'));

import Projects from './Components/Projects/index.js';
import Project from './Components/Projects/Project.js';
import TranscriptCorrect from './Components/Transcripts/TranscriptCorrect.js';
import PaperEdit from './Components/PaperEdits/PaperEdit';

const lightModePrimary = blue['900'];
const lightModeSecondary = red['900'];
const darkModePrimary = blue['400'];
const darkModeSecondary = red['700'];

const demoWarningMessage = (
  <>
    <p>
      This is a demo version of the app
      {/* <Link href="https://github.com/pietrop/digital-paper-edit-client" target="_blank" rel="noopener noreferrer">
        see project Github repository for more info
      </Link> */}
    </p>
    <p>This is a read-only demo you can only play around with existing projects!</p>
  </>
);

const NoMatch = () => {
  return <h1>There was an error loading the page you requested</h1>;
};

function App(props) {
  const online = useOnlineStatus();
  const [user, setUser] = useState(null);
  const initialDarkModeState = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkState, setDarkState] = useState(initialDarkModeState);
  const palletType = darkState ? 'dark' : 'light';
  const mainPrimaryColor = darkState ? darkModePrimary : lightModePrimary;
  const mainSecondaryColor = darkState ? darkModeSecondary : lightModeSecondary;

  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        //dark mode
        setDarkState(true);
      } else {
        //light mode
        setDarkState(false);
      }
    });
    // TODO: add a remove listener for the colro scheme change
  }, []);

  const handleUserChange = (isUserSignedIn) => {
    setUser(isUserSignedIn);
  };

  let envWarning = null;
  let offlineWarning = null;

  if (process.env.REACT_APP_NODE_ENV === 'demo') {
    envWarning = (
      <Container>
        <CustomAlert variant={'warning'} heading={'Demo mode'} message={demoWarningMessage} />
      </Container>
    );
  }

  if (!online) {
    offlineWarning = (
      <>
        <br />
        <Container>
          <CustomAlert
            variant={'warning'}
            heading={'Offline warning'}
            message={"You don't seem to be connected to the internet "}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {envWarning}
        {offlineWarning}
        <CustomNavbar firebase={firebase} handleUserChange={handleUserChange}>
          <span style={{ cursor: 'pointer' }} onClick={handleThemeChange}>
            {' '}
            {darkState ? <Brightness5Icon /> : <Brightness4Icon />}
          </span>
        </CustomNavbar>

        {user ? (
          <Suspense
            fallback={
              <Container>
                <br />
                <Grid>
                  <Skeleton variant="rect" width={'100%'} height={50} />
                </Grid>
                <br />
                <Grid>
                  <Skeleton variant="rect" width={'100%'} height={600} />
                </Grid>
              </Container>
            }
          >
            <Switch>
              <Route exact path={['/', '/projects']} component={Projects} />
              <Route exact path="/projects/:projectId" component={Project} />
              <Route
                exact
                path="/projects/:projectId/transcripts/:transcriptId/correct"
                component={TranscriptCorrect}
              />
              <Route
                exact
                path="/projects/:projectId/paperedits/:papereditId"
                component={PaperEdit}
              />
              <Route component={NoMatch} />
            </Switch>
          </Suspense>
        ) : (
          <Container>
            <br />
            <p className="text-center">
              <i>You need to login</i>
            </p>
          </Container>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
