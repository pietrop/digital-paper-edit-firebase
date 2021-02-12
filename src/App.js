import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
// import 'bootstrap-css-only/css/bootstrap.css';
// TODO: Note: Replace ^[theme]^ (examples: materia, darkly, slate, cosmo, spacelab, and superhero. See https://bootswatch.com for current theme names.)
// https://www.npmjs.com/package/react-bootstrap-theme-switcher
// import 'bootswatch/dist/litera/bootstrap.min.css';
import CustomAlert from './Components/lib/CustomAlert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import CustomNavbar from './CustomNavbar';
import firebase from './Firebase.js';

const Projects = lazy(() => import('./Components/Projects/index.js'));
const Project = lazy(() => import('./Components/Projects/Project.js'));
const TranscriptCorrect = lazy(() => import('./Components/Transcripts/TranscriptCorrect.js'));
const PaperEdit = lazy(() => import('./Components/PaperEdits/PaperEdit'));

const demoWarningMessage = (
  <>
    <p>
      This is a demo version of the app{' '}
      <Link href="https://github.com/pietrop/digital-paper-edit-client" target="_blank" rel="noopener noreferrer">
        see project Github repository for more info
      </Link>
    </p>
    <p>This is a read-only demo you can only play around with existing projects!</p>
  </>
);

const NoMatch = () => {
  return <h1>There was an error loading the page you requested</h1>;
};

function App(props) {
  // constructor(props) {
  //   super(props);

  //   // firebase.auth.onAuthStateChanged((user) => this.setState(user));
  // }
  // TODO: remove unused rootes
  const [user, setUser] = useState(null);

  useEffect(() => {});

  const handleUserChange = isUserSignedIn => {
    setUser(isUserSignedIn);
  };
  // eslint-disable-next-line class-methods-use-this
  // render() {
  let envWarning = null;
  let offlineWarning = null;

  if (process.env.REACT_APP_NODE_ENV === 'demo') {
    envWarning = (
      <Container>
        <CustomAlert variant={'warning'} heading={'Demo mode'} message={demoWarningMessage} />
      </Container>
    );
  }

  if (!navigator.onLine) {
    offlineWarning = (
      <>
        <br />
        <Container>
          <CustomAlert variant={'warning'} heading={'Offline warning'} message={"You don't seem to be connected to the internet "} />
        </Container>
      </>
    );
  }

  return (
    <>
      <HashRouter>
        {envWarning}
        {offlineWarning}
        <CustomNavbar firebase={firebase} handleUserChange={handleUserChange} />

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
              <Route exact path="/" component={Projects} />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/projects/:projectId" component={Project} />
              <Route exact path="/projects/:projectId/transcripts/:transcriptId/correct" component={TranscriptCorrect} />
              <Route exact path="/projects/:projectId/paperedits/:papereditId" component={PaperEdit} />
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
      </HashRouter>
    </>
  );
}

export default App;
