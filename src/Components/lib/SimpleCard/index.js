import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CustomLink from '../CustomLink';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  indigo: {
    // TODO: should pull from theme primary, so that if that change this changes as well
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
  },
}));

const SimpleCard = props => {
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
    return props.showLinkPath(props.id);
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <CustomLink to={showLinkPath()}>
            <Avatar alt={props.title} className={classes.indigo}>
              {props.icon}{' '}
            </Avatar>
          </CustomLink>
        </ListItemAvatar>

        <ListItemText primary={<CustomLink to={showLinkPath()}>{props.title}</CustomLink>} secondary={<>{props.description}</>} />
        <ListItemSecondaryAction>
          <IconButton size="small" color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default SimpleCard;
