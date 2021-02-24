import React from 'react';
import TranscriptForm from './TranscriptForm';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
function NewTranscriptFormModal(props) {
  const handleClose = () => {
    props.handleCloseModal();
  };

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.show} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle id="simple-dialog-title">{props.modalTitle}</DialogTitle>
        <DialogContent dividers={'paper'}>
          <TranscriptForm
            projectId={props.projectId}
            title={props.title}
            description={props.description}
            id={props.id}
            handleSaveForm={props.handleSaveForm}
            handleCloseModal={props.handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewTranscriptFormModal;
