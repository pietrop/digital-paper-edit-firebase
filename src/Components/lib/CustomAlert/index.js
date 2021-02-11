import React from 'react';
// https://material-ui.com/components/alert/#description
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomAlert(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity={props.variant}>
        {props.heading ? <AlertTitle>{props.heading}</AlertTitle> : ''}
        {props.message}
        {props.children}
      </Alert>
    </div>
  );
}
