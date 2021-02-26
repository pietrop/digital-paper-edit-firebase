import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const Controls = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    props.handlePlay();
    setIsPlaying(true);
  };

  const handlePause = () => {
    props.handlePause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    props.handleStop();
    setIsPlaying(false);
  };

  return (
    <>
      <Grid container>
        <Grid item item xs={12} sm={9} md={9} lg={9} xl={9}>
          <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth={true} size="small">
            <Button
              fullWidth={true}
              // variant="outlined"
              //color="primary"
              onClick={isPlaying ? handlePause : handlePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <Button
              fullWidth={true}
              // variant="outlined"
              // color="primary"
              onClick={handleStop}
            >
              <StopIcon />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item item xs={12} sm={3} md={3} lg={3} xl={3}>
          {props.children}
        </Grid>
      </Grid>
    </>
  );
};

export default Controls;

Controls.propTypes = {
  handleStop: PropTypes.any,
  handlePlay: PropTypes.any,
  handlePause: PropTypes.any,
};
