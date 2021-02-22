import React, { useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Container from '@material-ui/core/Container';
import CustomAlert from '../Components/lib/CustomAlert';
import MovieCreationOutlinedIcon from '@material-ui/icons/MovieCreationOutlined';
import GraphicEqOutlinedIcon from '@material-ui/icons/GraphicEqOutlined';
import LocalMoviesOutlinedIcon from '@material-ui/icons/LocalMoviesOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

// import CustomNotice from '../CustomNotice';

function CustomNavbar(props) {
  const { firebase } = props;
  const classes = useStyles();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        props.handleUserChange(true);
      } else {
        props.handleUserChange(false);
      }
      //   this.props.handleUserChange(user)
    });

    // https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1
    return function cleanup() {
      // TODO: add some clean up logic here for logout?
    };
  }, []);

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth ? firebase.auth.GoogleAuthProvider.PROVIDER_ID : null],
  };

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    hd: 'wsj.com',
  });

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <LocalMoviesOutlinedIcon />
          <Typography variant="h6" className={classes.title}>
            {process.env.REACT_APP_NAME}
          </Typography>

          {firebase.auth().currentUser ? (
            <>
              <Button color="inherit" onClick={() => firebase.auth().signOut()} title={`sign out ${firebase.auth().currentUser.displayName}`}>
                {' '}
                {firebase.auth().currentUser.email} <ExitToAppIcon />
              </Button>
            </>
          ) : (
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          )}
        </Toolbar>
      </AppBar>

      {navigator.onLine ? null : (
        <Container>
          <br />
          <CustomAlert variant="warning" message="You are offline" />
        </Container>
      )}
    </div>
  );
}

export default CustomNavbar;
