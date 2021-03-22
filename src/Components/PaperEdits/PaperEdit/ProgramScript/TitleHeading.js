import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

class TitleHeading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Typography variant="h6" gutterBottom color={'textSecondary'}>
        {this.props.title}
      </Typography>
    );
  }
}

export default TitleHeading;
