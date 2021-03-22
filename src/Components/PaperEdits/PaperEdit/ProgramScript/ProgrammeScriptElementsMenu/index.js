import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import RecordVoiceOverOutlinedIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import MicIcon from '@material-ui/icons/Mic';
import TitleIcon from '@material-ui/icons/Title';

export default function ProgrammeScriptElementsMenu(props) {
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
        <FormatListBulletedOutlinedIcon />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          title="Add a title header element to the programme script"
          onClose={handleClose}
          onClick={() => {
            props.handleAddTranscriptElementToProgrammeScript('title');
            handleClose();
          }}
        >
          <TitleIcon />
          Heading
        </MenuItem>
        <MenuItem
          title="Add a title voice over element to the programme script"
          onClose={handleClose}
          onClick={() => {
            props.handleAddTranscriptElementToProgrammeScript('voice-over');
            handleClose();
          }}
        >
          <MicIcon /> Voice Over
        </MenuItem>
        <MenuItem
          title="Add a note element to the programme script"
          onClose={handleClose}
          onClick={() => {
            props.handleAddTranscriptElementToProgrammeScript('note');
            handleClose();
          }}
        >
          <NoteOutlinedIcon />
          Note
        </MenuItem>
        {props.children}
      </Menu>
    </div>
  );
}
