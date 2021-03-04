import React, { Component } from 'react';
import path from 'path';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import CustomAlert from '../lib/CustomAlert/index.js';
import ApiWrapper from '../../ApiWrapper/index.js';
import whichJsEnv from '../../Util/which-js-env';
import NoNeedToConvertNotice from '../lib/NoNeedToConvertNotice/index.js';
import languages from './languages';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const LANGUAGE_US_ENGLISH_INDEX = 25;
const LANGUAGE_CODE_US_ENGLISH = 'en-US';
const DEFAULT_LANGUAGE_CODE = LANGUAGE_CODE_US_ENGLISH;
const DEFAULT_LANGUAGE_OPTION_INDEX = LANGUAGE_US_ENGLISH_INDEX;
const languagesOptions = languages.map((language) => {
  return {
    value: language.languageCode,
    label: `${language.Language} - ${language['Language (English name)']}`,
  };
});

// https://stackoverflow.com/questions/5953239/how-do-i-change-file-extension-with-javascript
function changeExtension(file, extension) {
  const basename = path.basename(file, path.extname(file));
  return path.join(path.dirname(file), basename + extension);
}

class TranscriptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.projectId,
      validated: false,
      redirect: false,
      newTranscriptId: null,
      uploading: false,
      uploadCompleted: false,
      mediaFileSelected: false,
      title: this.props.title,
      description: this.props.description,
      id: this.props.id,
      formData: null,
      adobeCepFilePath: null,
      savedNotification: null,
      progressValue: 0,
      languageCode: DEFAULT_LANGUAGE_CODE,
      audioPreviewSrc: '',
      audioPreviewProgressValue: 0,
      audioPreviewProgressValueAsTime: 0,
    };
    // console.log(process.env);
    // TODO: parse that and show time progress
    // maybe even speed
    // size=    1536kB time=00:01:44.17 bitrate= 120.8kbits/s speed=29.7x
    this.ffmpeg = createFFmpeg({
      // log: true,
      logger: ({ message }) => {
        const timeDurationRegex = /time=(.*) bitrate=/;
        const match = timeDurationRegex.exec(message);
        if (match) {
          const duration = match[1];
          // console.log('duration', duration);
          this.setState({ audioPreviewProgressValueAsTime: duration });
        }
        // console.log('message', message);
      },
    });
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  // This is used in Aobe CEP Panel integration only
  handleAdobeCepSetFilePath = () => {
    window.__adobe_cep__.evalScript(`$._PPP.get_current_project_panel_selection_absolute_path()`, (response) => {
      console.log('handleAdobeCepSetFilePath');
      if (response !== '') {
        console.log('handleAdobeCepSetFilePath', response);
        //  const newFilePath = response;
        //  fileName = path.basename(newFilePath);
        // TODO: add some visual quee that this worked (eg alert box at top? or file name/path somewhere)
        this.setState({
          title: path.basename(response),
          adobeCepFilePath: response,
        });
      } else {
        // TODO: review logic for edge case
        alert('select a clip');
      }
    });
  };
  updateProgressValue = (value) => {
    this.setState({
      progressValue: parseInt(value),
    });
  };

  transcode = async ({ target: { files } }) => {
    console.log('called transcoding');
    const { name } = files[0];
    console.log('name', name);
    await this.ffmpeg.load();
    this.ffmpeg.FS('writeFile', name, await fetchFile(files[0]));

    this.ffmpeg.setProgress((progress) => {
      const { ratio } = progress;
      // console.log('progress', progress);
      // console.log('ratio', ratio);
      this.setState({
        audioPreviewProgressValue: ratio * 100,
      });
    });

    await this.ffmpeg.run('-i', name, 'output.mp3');
    const data = this.ffmpeg.FS('readFile', 'output.mp3');
    // const video = document.getElementById('player');
    const blobData = new Blob([data.buffer], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blobData);
    console.log('url', url);
    this.setState({ audioPreviewSrc: url });
    const newName = changeExtension(name, '.mp3');
    const file = new File([blobData], newName, {
      type: 'audio/mp3',
    });
    return file;
  };

  // https://codeburst.io/react-image-upload-with-kittens-cc96430eaece
  handleFileUpload = async (e) => {
    // TODO: max file size of 2gig video to use ffmpeg client side to convert to audio
    const files = Array.from(e.target.files);
    // TODO: logic if it's video transcoding, otherwise if it's audio just go ahead
    // const file = files[0];
    const file = await this.transcode(e);
    console.log('file', file, file.type, file.path, file.name);

    // more on formData https://thoughtbot.com/blog/ridiculously-simple-ajax-uploads-with-formdata
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    // in electron file upload provides a path to the file
    if (file.path) {
      formData.append('path', file.path);
    }
    // console.log("formData.get('path')", formData.get('path'));
    this.setState({ mediaFileSelected: true, formData: formData });

    if (this.state.title === '') {
      this.setState({ title: file.name });
    }
  };

  handleLanguageChange = (selection) => {
    const { value } = selection;
    console.log(value);
    this.setState({ languageCode: value });
  };

  sendRequest = () => {
    this.setState({ uploading: true });

    const formData = this.state.formData;
    if (whichJsEnv() !== 'cep') {
      formData.append('title', this.state.title);
      formData.append('description', this.state.description);
      if (whichJsEnv() === 'browser') {
        formData.append('languageCode', this.state.languageCode);
      }
    }
    let data = {};
    if (whichJsEnv() === 'electron') {
      console.log("formData.get('path')", formData.get('path'));
      // if client run inside of electron
      // is easier to pass another object with title, description
      // as well as the additional path to the file
      // rather then parsing a formData object in node etc..
      data = {
        title: formData.get('title'),
        description: formData.get('description'),
        path: formData.get('path'),
      };
    }

    if (whichJsEnv() === 'cep') {
      data = {
        title: this.state.title,
        description: this.state.description,
        path: this.state.adobeCepFilePath,
      };
    }
    // TODO: do you need a try catch?
    try {
      ApiWrapper.createTranscript(this.state.projectId, this.state.formData, {}, this.updateProgressValue)
        .then((response) => {
          console.log('ApiWrapper.createTranscript-response ', response);
          // show message or redirect
          this.setState({
            uploading: false,
            uploadCompleted: true,
            redirect: true,
            newTranscriptId: response.transcriptId,
          });
          this.props.handleSaveForm(response.transcript);
          // this.props.handleCloseModal();
        })
        .catch((e) => {
          console.log('error:::: ', e);
          this.setState({
            uploading: false,
            redirect: false,
            savedNotification: (
              <CustomAlert
                dismissable={true}
                variant={'danger'}
                heading={'Error could not contact the server'}
                message={<p>There was an error trying to create this transcript on the server</p>}
              />
            ),
          });
        });
    } catch (e) {
      console.error('error submitting:::', e);
    }
  };

  handleSubmit(event) {
    const form = event.currentTarget;
    console.log('(form.checkValidity()', form.checkValidity());
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    }

    if (form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      this.sendRequest();
    }
  }

  render() {
    return (
      <>
        {this.state.savedNotification}

        {whichJsEnv() === 'electron' && <NoNeedToConvertNotice />}

        <form noValidate validated={this.state.validated} onSubmit={(e) => this.handleSubmit(e)}>
          <Grid container direction="column" justify="center" alignItems="stretch">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {whichJsEnv() === 'cep' ? (
                <>
                  <InputLabel>File </InputLabel>
                  <Button variant="light" onClick={this.handleAdobeCepSetFilePath} block>
                    Pick a file
                  </Button>
                  <InputLabel className="text-muted">
                    Select an audio or video file to transcribe. Click on a file in the Adobe Premiere project browser window, and the click{' '}
                    <code>pick a file</code> to select a file to transcribe. Then click <code>save</code> when you are ready to start the
                    transcriptiion.
                  </InputLabel>
                </>
              ) : (
                <FormControl controlId="formTranscriptMediaFile" fullWidth={true}>
                  <InputLabel>File </InputLabel>
                  <Input required type="file" label="Upload" accept="audio/*,video/*,.mxf, audio/x-m4a" onChange={this.handleFileUpload} />
                  <FormHelperText className="text-muted">
                    Select an audio or video file to transcribe. <br />
                    For video files, there's a limit to <code>2Gig</code> in file size
                  </FormHelperText>
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                  {/* <Form.Control.Feedback type="invalid">Please chose a audio or video file to transcribe</Form.Control.Feedback> */}
                </FormControl>
              )}
            </Grid>

            {this.state.audioPreviewProgressValue ? (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <br />
                  <br />
                  <InputLabel>Audio Preview </InputLabel>
                  <Chip label={this.state.audioPreviewProgressValueAsTime} />
                  <Chip avatar={<Avatar>%</Avatar>} label={parseInt(this.state.audioPreviewProgressValue)} />
                  <FormControl controlId="formTranscriptDescription" fullWidth={true}>
                    <br />
                    <LinearProgress variant="determinate" fullWidth={true} value={this.state.audioPreviewProgressValue} />
                    <br />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl controlId="formTranscriptTitle" fullWidth={true}>
                    {this.state.audioPreviewSrc ? <audio src={this.state.audioPreviewSrc} controls style={{ width: '100%' }}></audio> : null}
                  </FormControl>
                </Grid>
              </>
            ) : null}

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl controlId="formTranscriptTitle" fullWidth={true}>
                <InputLabel>Title </InputLabel>
                <Input
                  required
                  fullWidth={true}
                  type="text"
                  placeholder="Enter a transcript title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                />
                <FormHelperText className="text-muted">Chose a title for your Transcript</FormHelperText>
                {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                {/* <Form.Control.Feedback type="invalid">Please chose a title for your transcript</Form.Control.Feedback> */}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl controlId="formTranscriptDescription" fullWidth={true}>
                <InputLabel>Description </InputLabel>
                <Input
                  type="text"
                  fullWidth={true}
                  inputMultiline={true}
                  placeholder="Enter a Transcript description"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}
                />
                <FormHelperText className="text-muted">Chose an optional description for your Transcript</FormHelperText>
                {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                {/* <Form.Control.Feedback type="invalid">Please chose a description for your transcript</Form.Control.Feedback> */}
              </FormControl>
            </Grid>
            {whichJsEnv() === 'browser' && (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl controlId="exampleForm.SelectCustomSizeSm" fullWidth={true}>
                    <InputLabel>Language</InputLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <FormControl controlId="exampleForm.SelectCustomSizeSm" fullWidth={true}>
                    <Select
                      onChange={this.handleLanguageChange}
                      options={languagesOptions}
                      defaultValue={languagesOptions[DEFAULT_LANGUAGE_OPTION_INDEX]}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {this.state.progressValue !== 0 && (
                <>
                  <FormControl controlId="formTranscriptDescription" fullWidth={true}>
                    <br />
                    <LinearProgress variant="determinate" fullWidth={true} value={this.state.progressValue} />
                    <br />
                  </FormControl>
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <br />
              <Button variant="contained" color="primary" type="submit" disabled={this.state.uploading}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </>
    );
  }
}

export default TranscriptForm;
