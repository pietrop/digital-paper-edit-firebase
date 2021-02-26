import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function WaveFormChoiceMenu(props) {
  const [currentSelection, setcurrentSelection] = React.useState('Select waveform style');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        fullWith={true}
        aria-controls="simple-menu"
        //   aria-haspopup="true"
        onClick={handleClick}
      >
        {currentSelection}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            props.handleSetWaveFormMode('cline');
            setcurrentSelection('cline');
          }}
        >
          cline
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.handleSetWaveFormMode('point');
            setcurrentSelection('point');
          }}
        >
          point
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.handleSetWaveFormMode('p2p');
            setcurrentSelection('p2p');
          }}
        >
          p2p
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.handleSetWaveFormMode('line');
            setcurrentSelection('line');
          }}
        >
          line
        </MenuItem>
      </Menu>
    </div>
  );
}
