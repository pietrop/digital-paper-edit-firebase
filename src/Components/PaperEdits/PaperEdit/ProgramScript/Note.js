import React, { Component } from 'react';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import Typography from '@material-ui/core/Typography';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      // <p className={'text-secondary'}>
      <Typography variant="body2" display="block" gutterBottom color={'textSecondary'}>
        <NoteOutlinedIcon /> {this.props.text}
      </Typography>
      // </p>
    );
  }
}

export default Note;
