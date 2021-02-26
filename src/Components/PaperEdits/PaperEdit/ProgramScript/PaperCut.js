import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class PaperCut extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let words;
    if (this.props.words) {
      // TODO could wrap words in span and add timecodes
      // to make it cliccable on programme script
      words = this.props.words.map((w, index) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <span
            // TODO: add w.id to words to us as index?
            key={w.start + index}
            className="words"
            title={`stat: ${w.start}- end: ${w.end}`}
            data-start={w.start}
            data-end={w.end}
          >
            {w.text}{' '}
          </span>
        );
      });
    }

    return (
      <>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={3}
            xl={3}
            className={'text-truncate text-muted'}
            // TODO: could add timecode from eg -  ${ shortTimecode(this.props.words[0].start) }
            // TODO: Could add transcript name along side the timecode for the paper-cut
            title={`${this.props.speaker.toUpperCase()}`}
            style={{ userSelect: 'none' }}
          >
            <Typography variant="button" display="block" gutterBottom>
              {this.props.speaker}
            </Typography>

            {/* <strong>{this.props.speaker.toUpperCase()}</strong> */}
            {/* <br/> */}
            {/* <u style={ { cursor: 'pointer' } }>00:01:20</u> */}
            {/* <br/> */}
            {/* <FontAwesomeIcon icon={ faTag } />TagExample */}
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={9} xl={9}>
            {/* <p>{ JSON.stringify(this.props.words) }</p> */}
            <Typography variant="body2" display="block" gutterBottom>
              {words}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default PaperCut;
