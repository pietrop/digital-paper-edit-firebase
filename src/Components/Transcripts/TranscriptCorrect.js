import React, { Suspense, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import path from 'path';
import Container from '@material-ui/core/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomBreadcrumb from '../lib/CustomBreadcrumb/index.js';
import ApiWrapper from '../../ApiWrapper/index.js';
import CustomAlert from '../lib/CustomAlert/index.js';
import Skeleton from '@material-ui/lab/Skeleton';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// const TranscriptEditor = React.lazy(() => import('slate-transcript-editor'));
import TranscriptEditor from 'slate-transcript-editor';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TranscriptCorrect(props) {
  const [projectId, setProjectId] = useState(props.match.params.projectId);
  const [transcriptId, setTranscriptId] = useState(props.match.params.transcriptId);
  const [transcriptJson, setTranscriptJson] = useState(null);
  const [url, setUrl] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [transcriptTitle, setTranscriptTitle] = useState('');
  const [savedNotification, setSavedNotification] = useState(null);
  const [clipName, setClipName] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    try {
      ApiWrapper.getTranscript(projectId, transcriptId)
        // TODO: add error handling
        .then((json) => {
          console.log('json', json);
          setProjectTitle(json.projectTitle);
          setTranscriptTitle(json.transcriptTitle);
          setTranscriptJson(json.transcript);
          setUrl(json.url);
          setClipName(json.clipName);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (autoSaveData) => {
    console.log('handleSave', autoSaveData);
    const data = autoSaveData;
    data.title = transcriptTitle;
    data.transcriptTitle = transcriptTitle;
    const queryParamsOptions = false;
    ApiWrapper.updateTranscript(projectId, transcriptId, queryParamsOptions, data)
      .then((response) => {
        console.log('ApiWrapper.updateTranscript', response);
        if (response.ok) {
          // show message or redirect
          console.log('updated');
          // More discrete auto save notification

          setSavedNotification(
            <Alert
              onClose={() => {
                setSavedNotification(null);
              }}
              severity="success"
            >
              {`Saved transcript: ${transcriptTitle}`}
            </Alert>
          );
        }
      })
      .catch((e) => {
        console.error('error saving transcript:: ', e);
        setSavedNotification(
          <Alert
            onClose={() => {
              setSavedNotification(null);
            }}
            severity="error"
          >
            {`There was an error trying to save this transcript: ${transcriptTitle} `}
          </Alert>
        );
      });
  };

  const redirectToAnnotatePage = () => {
    // projectId transcriptId
    // setState({
    //   redirect: true,
    // });
    setRedirect(true);
  };

  const renderRedirect = () => {
    if (redirect) {
      // return <Redirect to={`/projects/${projectId}/transcripts/${newTranscriptId}/annotate`} />;
    }
  };

  // Workaround to change layout of TranscriptEditor for audio files.
  // For now only handling limited numnber of file extension that have more of a certainty of being audio
  // as opposed to more ambiguos extensions such as ogg or mp4 that could be either video or audio
  // there might be better ways to determine if a clip is audio or video, especially node/"server side" but
  // might also be more of a setup eg using ffprobe etc..
  let mediaType = 'video';
  if (
    path.extname(clipName) === '.wav' ||
    path.extname(clipName) === '.mp3' ||
    path.extname(clipName) === '.m4a' ||
    path.extname(clipName) === '.flac' ||
    path.extname(clipName) === '.aiff'
  ) {
    mediaType = 'audio';
  }
  return (
    <>
      {renderRedirect()}
      <Container
        style={
          {
            // backgroundColor: '#eee',
          }
        }
        fluid
      >
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={savedNotification}
          autoHideDuration={6000}
          onClose={() => {
            setSavedNotification(null);
          }}
        >
          {savedNotification}
        </Snackbar>

        <br />
        <Row>
          <Col sm={12} md={12} ld={12} xl={12} style={{ marginBottom: '0' }}>
            <CustomBreadcrumb
              backgroundColor={'transparent'}
              items={[
                {
                  name: 'Projects',
                  link: 'projects',
                },
                {
                  name: `Project: ${projectTitle}`,
                  link: `projects/${projectId}`,
                },
                {
                  name: 'Transcripts',
                },
                {
                  name: `${transcriptTitle}`,
                },
              ]}
            />
          </Col>
        </Row>
        {/* {savedNotification} */}
        {transcriptJson !== null && (
          <Suspense
            fallback={
              <Container fluid>
                <Row>
                  <Col xs={12} sm={3} md={3} lg={3} xl={3}>
                    <Skeleton variant="rect" width={'100%'} height={100} />
                  </Col>
                  <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                    <Skeleton variant="rect" width={'100%'} height={600} />
                  </Col>
                  <Col xs={12} sm={1} md={1} lg={1} xl={1}>
                    <Skeleton variant="rect" width={'100%'} height={350} />
                  </Col>
                </Row>
              </Container>
            }
          >
            <TranscriptEditor
              transcriptData={transcriptJson} // Transcript json
              mediaUrl={url} // string url to media file - audio or video
              // showTitle={true}
              isEditable={true} // se to true if you want to be able to edit the text
              title={transcriptTitle}
              mediaType={mediaType}
              autoSaveContentType={'digitalpaperedit'}
              handleSaveEditor={handleSave}
              // handleAutoSaveChanges={ handleSave }
            />
          </Suspense>
        )}
      </Container>
    </>
  );
}

export default TranscriptCorrect;
