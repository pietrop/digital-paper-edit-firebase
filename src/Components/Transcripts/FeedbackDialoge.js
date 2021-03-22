import React, { useState } from 'react';
import Rating from '@material-ui/lab/Rating';
// import { Button, Dialog, Illustration, TextareaAutosize } from '@screentone/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendIcon from '@material-ui/icons/Send';
// import Button from '@material-ui/core/Button';
import ApiWrapper from '../../ApiWrapper/index.js';
import { version as appVersion } from '../../../package.json';

function FeedbackDialoge({
  //   analytics,
  //   isOpen,
  //   setIsFeedbackDialogeOpen,
  api,
  transcriptId,
  projectId,
  slackName,
  slackUrl,
  sttEngine,
}) {
  const [sttRating, setSttRating] = useState(null);
  const [sttFeeback, setSttFeedback] = useState('');
  const [toolRating, setToolRating] = useState(null);
  const [toolFeedback, setToollFeedback] = useState('');
  const [isFeedbackDialogeOpen, setIsFeedbackDialogeOpen] = useState(false);

  console.log('appVersion', appVersion);

  const handleSubmit = async () => {
    const overallRating = {
      sttRating,
      sttFeeback,
      toolRating,
      toolFeedback,
      transcriptId,
      projectId,
      sttEngine,
      appVersion,
    };
    if (sttRating && toolRating) {
      console.log('send', overallRating);

      const resp = await ApiWrapper.submitFeedback(overallRating);
      //   analytics.logEvent('feedback_stt_and_tool', { fn: 'handleSubmit', ...overallRating });
      console.log('resp', resp);
      setSttRating(null);
      setSttFeedback('');
      setToolRating(null);
      setToollFeedback('');
      setIsFeedbackDialogeOpen(false);
    }
  };

  const openFeedBackDdialoge = () => {
    // analytics.logEvent('feedback_open_dialoge', {
    //   fn: 'openFeedBackDdialoge',
    //   isFeedbackDialogeOpen: !isFeedbackDialogeOpen,
    // });
    setIsFeedbackDialogeOpen(!isFeedbackDialogeOpen);
  };
  return (
    <>
      <Button color="primary" size="small" onClick={openFeedBackDdialoge}>
        <SendIcon /> Feedback
      </Button>
      <Dialog
        open={isFeedbackDialogeOpen}
        onClose={() => {
          // analytics.logEvent('feedback_close_dialoge', {
          //   fn: 'onDismiss',
          // });
          openFeedBackDdialoge(false);
        }}
        status={isFeedbackDialogeOpen}
      >
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          {/* <Illustration
          style={{ width: '50%', height: '50%', marginLeft: 'auto', marginRight: 'auto' }}
          name="typewriter"
        /> */}
          <p>How would you rate the quality of the automated transcription?</p>
          <Rating
            name="simple-controlled"
            value={sttRating}
            onChange={(event, sttRating) => {
              console.log('sttRating', sttRating, event);
              // analytics.logEvent('feedback_set_stt_ratings', { fn: 'sttRating_onChange', sttRating });
              setSttRating(sttRating);
            }}
          />
          <br />
          <TextField
            label="Optional feedback on the quality of the automated transcription"
            fullWidth
            multiline
            rows={2}
            rowsMax={4}
            type="text"
            name="name"
            value={sttFeeback}
            onChange={(e) => {
              setSttFeedback(e.target.value);
            }}
            placeholder="Optional feedback on the quality of the automated transcription"
          />
          <p> How would you rate the WSJ Newsroom Transcript editor experience?</p>
          <Rating
            name="simple-controlled-tool"
            value={toolRating}
            onChange={(event, toolRating) => {
              console.log('toolRating', toolRating, event);
              // analytics.logEvent('feedback_set_tool_ratings', {
              //   fn: 'toolRating_onChange',
              //   sttRating,
              // });
              setToolRating(toolRating);
            }}
          />
          <br />
          <TextField
            label="Optional feedback on The WSJ Newsroom Transcription tool"
            fullWidth
            multiline
            rows={2}
            rowsMax={4}
            type="text"
            name="name"
            value={toolFeedback}
            onChange={(e) => {
              setToollFeedback(e.target.value);
            }}
            placeholder="Optional feedback on The WSJ Newsroom Transcription tool"
          />
          {slackUrl && (
            <p>
              You can also reach us on slack
              <a href={slackUrl} target="_blank" rel="noopener noreferrer">
                {' '}
                <code>#{slackName}</code>
              </a>
            </p>
          )}
          {/* add slack channel programmatically */}
        </DialogContent>
        <DialogActions>
          {/* <Button secondary>Disagree</Button> */}
          <Button primary onClick={handleSubmit}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FeedbackDialoge;
