import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';

const playIcon = <FontAwesomeIcon icon={faPlay} />;
const pauseIcon = <FontAwesomeIcon icon={faPause} />;
const stopIcon = <FontAwesomeIcon icon={faStop} />;

class Controls extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
    };
  }

  handlePlay = () => {
    this.props.videoContext.play();
    this.setState({ isPlaying: true });
  };

  handlePause = () => {
    this.props.videoContext.pause();
    this.setState({ isPlaying: false });
  };

  handleStop = () => {
    this.props.videoContext.pause();
    this.props.videoContext.currentTime = 0;
    this.setState({ isPlaying: false });
  };

  render() {
    return (
      <>
        <Grid
          item
          sm={6}
          md={6}
          ld={6}
          xl={6}
          // className={ 'col-auto' }
        >
          <Button size="sm" block variant="light" onClick={this.state.isPlaying ? this.handlePause : this.handlePlay}>
            {this.state.isPlaying ? pauseIcon : playIcon}
          </Button>
        </Grid>
        <Grid
          item
          sm={6}
          md={6}
          ld={6}
          xl={6}
          // className={ 'col-auto' }
        >
          <Button size="sm" block variant="light" onClick={this.handleStop}>
            {stopIcon}
          </Button>
        </Grid>
      </>
    );
  }
  q;
}

export default Controls;
