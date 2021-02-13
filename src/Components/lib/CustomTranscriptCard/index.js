import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SyncIcon from '@material-ui/icons/Sync';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CustomLink from '../CustomLink';

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

// const LinkBehavior = React.forwardRef((props, ref) => <RouterLink ref={ref} {...props} />);

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

  const showLinkPath = () => {
    // console.log('props.showLinkPath(props.id)', props.showLink(props.id));
    return props.showLink(props.id);
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

  // let title = <a href={`#${props.showLink()}`}> {props.title}</a>;
  let title = props.title;
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
    <>
      {/* <Router> */}{' '}
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <CustomLink to={showLinkPath()}>
            <Avatar alt={props.title}>{props.icon} </Avatar>
          </CustomLink>
        </ListItemAvatar>
        <ListItemText primary={<CustomLink to={showLinkPath()}>{props.title}</CustomLink>} secondary={props.description} />

        <ListItemSecondaryAction>
          <IconButton size="small" color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <DeleteOutlinedIcon />
          </IconButton>

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
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
      {/* </Router> */}
    </>
  );
}

export default CustomTranscriptCard;
