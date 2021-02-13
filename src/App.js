import React, { useState, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomAlert from './Components/lib/CustomAlert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
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
  const [user, setUser] = useState(null);

  const handleUserChange = isUserSignedIn => {
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
            <Route exact path={['/', '/projects']} component={Projects} />
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
    </>
  );
}

export default App;
