import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import RecordVoiceOverOutlinedIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import MicIcon from '@material-ui/icons/Mic';
import ReplyOutlinedIcon from '@material-ui/icons/ReplyOutlined';
import TitleIcon from '@material-ui/icons/Title';
// import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GraphicEqOutlinedIcon from '@material-ui/icons/GraphicEqOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import HeadsetOutlinedIcon from '@material-ui/icons/HeadsetOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import OndemandVideoOutlinedIcon from '@material-ui/icons/OndemandVideoOutlined';
import TheatersOutlinedIcon from '@material-ui/icons/TheatersOutlined';
import CodeOutlinedIcon from '@material-ui/icons/CodeOutlined';
import Divider from '@material-ui/core/Divider';

import whichJsEnv from '../../../../../Util/which-js-env';
import { propTypes } from 'react-bootstrap/esm/Image';

export default function ExportMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button color="primary" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <ReplyOutlinedIcon />
      </Button>

      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {whichJsEnv() === 'cep' && (
          <MenuItem
            title="export the programme script as a sequence in Adobe Premiere"
            onClose={handleClose}
            onClick={() => {
              props.handleCepExportSequence();
              handleClose();
            }}
          >
            Premiere - Sequence
            {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
          </MenuItem>
        )}

        <MenuItem
          title="export EDL, edit decision list, to import the programme script as a sequence in video editing software - Avid, Premiere, Davinci Resolve, for FCPX choose FCPX XML"
          onClose={handleClose}
          onClick={() => {
            props.handleExportEDL();
            handleClose();
          }}
        >
          <TheatersOutlinedIcon />
          EDL - Video
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="export FCPX XML, to import the programme script as a sequence in Final Cut Pro X, video editing software"
          onClose={handleClose}
          onClick={() => {
            props.handleExportFCPX();
            handleClose();
          }}
        >
          <TheatersOutlinedIcon />
          FCPX
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="export ADL, audio decision list, to import the programme script as a sequence in audio editing software such as SADiE"
          onClose={handleClose}
          onClick={() => {
            props.handleExportADL();
            handleClose();
          }}
        >
          <HeadsetOutlinedIcon />
          ADL - Audio
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="export XML, audio decision list, to import the programme script as a sequence in audio editing software such as Audition"
          onClose={handleClose}
          onClick={() => {
            props.handleExportXML();
            handleClose();
          }}
        >
          <HeadsetOutlinedIcon />
          XML - Audition
          <InfoOutlinedIcon />
        </MenuItem>
        <Divider />
        <MenuItem
          title="export Text, export the programme script as a text version"
          onClose={handleClose}
          onClick={() => {
            props.handleExportTxt();
            handleClose();
          }}
        >
          <DescriptionOutlinedIcon />
          Text File
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="export Text, export only the text selection in the programme script as a text version"
          onClose={handleClose}
          onClick={() => {
            props.handleExportTxtOnyPaperCuts();
            handleClose();
          }}
        >
          <DescriptionOutlinedIcon />
          Text File (only text selection)
          <InfoOutlinedIcon />
        </MenuItem>
        <Divider />
        <MenuItem
          title="export docx, export the programme script as a word document"
          onClose={handleClose}
          onClick={() => {
            props.handleExportDocx();
            handleClose();
          }}
        >
          <DescriptionOutlinedIcon />
          Word Document
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="export docx, export the programme script as a word document, with clip name and timecode references, for text selections"
          onClose={handleClose}
          onClick={() => {
            props.handleExportDocxWithClipReference();
            handleClose();
          }}
        >
          <DescriptionOutlinedIcon />
          Word Doc (with ref)
          <InfoOutlinedIcon />
        </MenuItem>
        <Divider />
        <MenuItem
          title="Export mp4 video preview - Experimental feature, at the moment you cannot combine audio and video in the same export."
          onClose={handleClose}
          onClick={() => {
            props.handleExportVideoPreview();
            handleClose();
          }}
        >
          <VideocamOutlinedIcon />
          Video (mp4)
          <InfoOutlinedIcon />
        </MenuItem>

        <MenuItem
          title="Export wav audio preview - Experimental feature, at the moment you cannot combine audio and video in the same export."
          onClose={handleClose}
          onClick={() => {
            props.handleExportAudioPreview();
            handleClose();
          }}
        >
          {/* <OndemandVideoOutlinedIcon /> */}
          <GraphicEqOutlinedIcon />
          Audio (wav)
          <InfoOutlinedIcon />
        </MenuItem>
        <Divider />
        <MenuItem
          title="export Json, export the programme script as a json file"
          onClose={handleClose}
          onClick={() => {
            props.handleExportJson();
            handleClose();
          }}
        >
          <CodeOutlinedIcon />
          Json
          <InfoOutlinedIcon />
        </MenuItem>
        {props.children}
      </Menu>
    </div>
  );
}
