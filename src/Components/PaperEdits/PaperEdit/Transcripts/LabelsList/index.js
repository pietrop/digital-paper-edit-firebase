import React, { Component, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
// import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

import LabelModal from './LabelModal';
import { randomColor } from './css-color-names.js';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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

const LabelsList = (props) => {
  // const classes = useStyles();
  const [isLabelmodalShown, setIsLabelmodalShown] = useState(false);

  const removeLabel = (id, e) => {
    console.log('removeLabel', id);
    // eslint-disable-next-line no-restricted-globals
    const response = confirm('Click OK to delete the label, Cancel if you changed your mind');
    if (response === true) {
      props.onLabelDelete(id);
    } else {
      alert('Your label was not deleted');
    }
  };

  // TODO: See if CreateNewLabelModal can be refactored to accomodate for edit label
  // if not then separate model to achieve same
  // https://stackoverflow.com/questions/43335452/pass-item-data-to-a-react-modal
  // const editLabel = (id, e) => {
  //   console.log('editLabel', id);
  //   const labelToEdit = props.labelsOptions.filter((label) => {
  //     return label.id === id;
  //   });
  // };
  const onLabelSaved = (newLabel) => {
    console.log('onLabelSaved', newLabel);
    // if updated - labelId is diff from null
    if (newLabel.id) {
      props.onLabelUpdate(newLabel);
    }
    // if created
    else {
      props.onLabelCreate(newLabel);
    }
  };

  // const showLabelModal = () => {
  //   console.log(isLabelmodalShown);
  //   setIsLabelmodalShown(!isLabelmodalShown);
  // };

  // TODO: add CSS to label and description to constrain width?
  // move edit and X to the rigth
  let labelsListOptions;
  // Handle edge case if there's no labels
  if (props.labelsOptions) {
    labelsListOptions = props.labelsOptions.map((label, index) => {
      return (
        <ListItem style={{ width: '100%' }} key={'label_' + index}>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: label.color }}>
              <LocalOfferOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={label.label} secondary={label.description} />
          <ListItemText
            secondary={
              <>
                {label.label.toLowerCase() !== 'default' ? (
                  <LabelModal
                    color={label.color}
                    label={label.label}
                    description={label.description}
                    labelId={label.id}
                    show={isLabelmodalShown}
                    onLabelSaved={onLabelSaved}
                    openBtn={<CreateOutlinedIcon />}
                  />
                ) : (
                  <Button title={'edit label'} size="sm" disabled>
                    <CreateOutlinedIcon />
                  </Button>
                )}
                <Button
                  title={'delete label'}
                  size="sm"
                  onClick={(e) => {
                    removeLabel(label.id, e);
                  }}
                  disabled={label.label.toLowerCase() === 'default' ? true : false}
                >
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </>
            }
          ></ListItemText>
          <Divider />
        </ListItem>
      );
    });
  }

  const labelsList = <List style={{ height: '80vh', width: '20vw', overflowY: 'scroll', overflowX: 'hidden' }}>{labelsListOptions}</List>;
  // const labelsList = labelsListOptions;

  return (
    <>
      {props.isLabelsListOpen && (
        <>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                <LocalOfferOutlinedIcon /> <SettingsOutlinedIcon />
                Labels
              </Typography>
            </CardContent>
            <Divider />
            {labelsList}
            <CardActions className="text-muted">
              <LabelModal
                color={randomColor()}
                label={''}
                description={''}
                labelId={null}
                show={isLabelmodalShown}
                onLabelSaved={onLabelSaved}
                openBtn={
                  <>
                    <SettingsOutlinedIcon /> Create New Label
                  </>
                }
              />
            </CardActions>
          </Card>
        </>
      )}
    </>
  );
  // }
};

export default LabelsList;
