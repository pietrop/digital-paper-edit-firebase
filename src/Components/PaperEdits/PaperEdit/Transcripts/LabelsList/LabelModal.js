import React, { Component, useState } from 'react';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Button from '@material-ui/core/Button';
import LabelForm from './LabelForm.js';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const LabelModal = ({ color, label, description, labelId, onLabelSaved, openBtn }) => {
  const classes = useStyles();

  const [show, setShow] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  return (
    <>
      <Button onClick={handleShow} block>
        {openBtn}
      </Button>

      <Modal open={show} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h5">
            <SettingsOutlinedIcon />
            Label
          </Typography>
          <LabelForm onLabelSaved={onLabelSaved} label={label} description={description} color={color} labelId={labelId} handleClose={handleClose} />
        </div>
      </Modal>
    </>
  );
};
export default LabelModal;
