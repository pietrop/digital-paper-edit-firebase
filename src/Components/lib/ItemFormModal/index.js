import React from 'react';
import ItemForm from '../ItemForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

function ItemFormModal(props) {
  const handleClose = () => {
    props.handleCloseModal();
  };

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.show} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle id="simple-dialog-title">{props.modalTitle}</DialogTitle>
        <ItemForm title={props.title} description={props.description} id={props.id} handleSaveForm={props.handleSaveForm} />
      </Dialog>
    </>
  );
}

export default ItemFormModal;
