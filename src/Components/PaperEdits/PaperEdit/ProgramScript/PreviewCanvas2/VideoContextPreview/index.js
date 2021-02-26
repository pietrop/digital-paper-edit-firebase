import React, { useState, useEffect } from 'react';
import VideoContextProgressBar from './VideoContextProgressBar';
import Controls from './Controls';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import TimerOutlinedIcon from '@material-ui/icons/TimerOutlined';
import PropTypes from 'prop-types';
import VideoContext from 'videocontext';

const VideoContextPreview = (props) => {
  const [videoContext, setVideoContext] = useState();

  const updateVideoContext = (media) => {
    media.forEach(({ type, sourceStart, start, duration, src }) => {
      const node = videoContext[type](src, sourceStart);
      node.startAt(start);
      node.stopAt(start + duration);
      node.connect(videoContext.destination);
    });
  };

  const handleStop = () => {
    videoContext.pause();
    setVideoContext((vc) => {
      vc.currentTime = 0;

      return vc;
    });
  };

  useEffect(() => {
    if (props.canvasRef && props.canvasRef.current) {
      setVideoContext(new VideoContext(props.canvasRef.current));
    }
  }, [props.canvasRef]);

  if (videoContext) {
    updateVideoContext(props.playlist);
  }

  const secondsToHHMMSSFormat = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={'justify-content-center'}
        style={{ backgroundColor: '#353839' }}
      >
        <canvas ref={props.canvasRef} width={props.width} height={props.width * 0.5625} />
      </Grid>
      <Grid container className={'justify-content-center'} style={{ backgroundColor: 'lightgrey' }}>
        <VideoContextProgressBar videoContext={videoContext} />
      </Grid>
      <Grid container style={{ marginTop: '0.4em' }}>
        <Controls
          handlePlay={videoContext ? () => videoContext.play() : () => console.log('handlePlay')}
          handlePause={videoContext ? () => videoContext.pause() : () => console.log('handlePause')}
          handleStop={videoContext ? () => handleStop() : () => console.log('handleStop')}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            // className={'justify-content-center'}
          >
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
              <TextField
                title="total duration"
                fullWidth={true}
                disabled
                // id="input-with-icon-grid"
                // label="Total duration"
                value={videoContext ? secondsToHHMMSSFormat(videoContext.duration) : '00:00:00'}
              />
            </Grid>
            {/* </Grid> */}
          </Grid>
        </Controls>
      </Grid>
    </>
  );
};

VideoContextPreview.propTypes = {
  canvasRef: PropTypes.any,
  playlist: PropTypes.array,
  videoContext: PropTypes.any,
  width: PropTypes.any,
};

VideoContextPreview.defaultProps = {
  playlist: [],
};

export default VideoContextPreview;
