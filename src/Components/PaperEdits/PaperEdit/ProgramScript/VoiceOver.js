import React, { Component } from 'react';
import MicOutlinedIcon from '@material-ui/icons/MicOutlined';
import Typography from '@material-ui/core/Typography';

class VoiceOver extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        {/* <p className={'text-muted'}> */}

        <Typography variant="body2" display="block" gutterBottom color={'textSecondary'}>
          <MicOutlinedIcon /> {this.props.text}
        </Typography>
        {/* </p> */}
      </>
    );
  }
}

export default VoiceOver;
