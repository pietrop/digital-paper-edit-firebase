import React, { Component, useEffect } from 'react';
// import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import Badge from 'react-bootstrap/Badge';
import { Alert, AlertTitle } from '@material-ui/lab';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faExclamationTriangle, faPen } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Grid from '@material-ui/core/Grid';
import SyncIcon from '@material-ui/icons/Sync';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
    marginTop: '1em',
    marginBottom: '1em',
  },
  media: {
    height: 140,
  },
});

function CustomTranscriptCard(props) {
  const classes = useStyles();

  const handleDelete = () => {
    //eslint-disable-next-line
    const confirmationPrompt = confirm("Click OK if you wish to delete, cancel if you don't");
    if (confirmationPrompt === true) {
      if (props.handleDelete) {
        props.handleDelete(props.id);
      }
    } else {
      alert('All is good, it was not deleted');
    }
  };
  const handleEdit = () => {
    props.handleEdit(props.id);
  };

  let status;
  let errorMessageAlert;
  if (props.status === 'error') {
    status = 'danger';
  }
  if (props.status === 'in-progress') {
    status = 'info';
    // statusBadge = <Badge variant="info">In progress</Badge>;
  }
  if (props.status === 'done') {
    // statusBadge = <Badge variant="success">Success</Badge>;
    status = 'success';
  }

  let title = <a href={`#${props.showLink()}`}> {props.title}</a>;
  if (status && status === 'info') {
    title = props.title;
  }
  if (status && status === 'danger') {
    title = props.title;
    // borderStatus = 'danger';
  }

  if (props.status === 'error') {
    errorMessageAlert = (
      <>
        <Alert severity="danger">
          <AlertTitle>Error</AlertTitle>
          {props.errorMessage}
        </Alert>
      </>
    );
  }

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardActions>
          <Grid container container direction="row" justify="space-between" alignItems="flex-start">
            <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
              <Typography gutterBottom variant="h5" component="h2" color="textSecondary" noWrap title={props.title}>
                {/* <Link href={`#${showLinkPath()}`}> */}
                {props.icon ? props.icon : ''} {title}
                {/* </Link> */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
              <Grid container direction="row" justify="flex-end" alignItems="flex-start">
                <Grid item>
                  <IconButton size="small" color="primary" onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item item>
                  <IconButton size="small" color="primary" onClick={handleDelete}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  {status && status === 'info' ? (
                    <Button variant="info" size="sm" disabled>
                      {/* <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> */}
                      <SyncIcon style={{ color: '#35baf6' }} />
                    </Button>
                  ) : (
                    ''
                  )}
                  {status && status === 'danger' ? (
                    <Button variant="danger" size="sm" disabled>
                      {/* <FontAwesomeIcon icon={faExclamationTriangle} /> */}
                      <WarningOutlinedIcon color="secondary" />
                    </Button>
                  ) : (
                    ''
                  )}
                  {status && status === 'success' ? (
                    <Button variant="success" size="sm" disabled>
                      {/* <FontAwesomeIcon icon={faCheck} /> */}
                      <CheckBoxOutlinedIcon style={{ color: '#009688' }} />
                    </Button>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardActions>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
          {/* <Typography variant="p" gutterBottom>
            Created {props.date}
          </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CustomTranscriptCard;
