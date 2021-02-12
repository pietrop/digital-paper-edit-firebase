import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import BatchTranscriptForm from './BatchTranscriptForm';

function NewBatchTranscriptFormModal(props) {
  const handleClose = () => {
    props.handleCloseModal();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.show}>
      <DialogTitle id="simple-dialog-title">{props.modalTitle}</DialogTitle>
      <BatchTranscriptForm
        projectId={props.projectId}
        title={props.title}
        description={props.description}
        id={props.id}
        handleSaveForm={props.handleSaveForm}
        handleCloseModal={props.handleCloseModal}
      />
    </Dialog>
  );
}

export default NewBatchTranscriptFormModal;
