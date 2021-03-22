import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { shortTimecode } from 'slate-transcript-editor';
import styles from './index.module.css';

/**
 *  Paragraph display preferences based on search
 *
 *  styles to separate the look of non contiguous paragraphs?
 */

class Paragraph extends Component {
  render() {
    const { paragraphDisplayPreference } = this.props;
    // const inContextSearch = paragraphDisplayPreference;
    paragraphDisplayPreference.borderStyle = 'dashed';
    paragraphDisplayPreference.borderWidth = '0.01em';
    paragraphDisplayPreference.borderColor = 'lightgray';
    paragraphDisplayPreference.padding = '0.5em';

    // inContextSearch.display = 'block';
    let paragraphStyle = {};
    if (this.props.showParagraphsMatchingSearch) {
      paragraphStyle = this.props.paragraphDisplayPreference;
    } else {
      if (!paragraphDisplayPreference.display) {
        delete paragraphDisplayPreference.display;
        // paragraphStyle.borderColor = 'orange';
        // paragraphStyle.borderStyle = 'dashed';
        // paragraphStyle.borderWidth = '0.01em';
        paragraphStyle.borderRight = '0.1em dashed lightgrey';
        paragraphStyle.borderLeft = '0.1em dashed lightgrey';
      }
    }

    return (
      <Grid container style={{ ...paragraphStyle }} className="paragraph" data-paragraph-text={this.props.paragraphTextWithoutPunctuation}>
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={2}
          style={{ cursor: 'pointer', width: '100%' }}
          className={'text-truncate'}
          title={`${this.props.speakerName.toUpperCase()} -  ${shortTimecode(
            this.props.paragraph[0].start
          )} | Click on a speaker to jump to the corresponding time in the media.`}
        >
          <span className={[styles.speaker, styles.unselectable, 'timecode'].join(' ')} data-start={this.props.paragraph[0].start} tabIndex="0">
            {this.props.speakerName}
          </span>
        </Grid>
        {/* <Col xs={ 4 } sm={ 4 } md={ 2 } lg={ 2 } xl={ 1 }
          style={ { padding: '0em', textAlign: 'center' } }
          className={ styles.unselectable }
        >
          <span
            style={ { cursor: 'pointer', width: '100%' } }
            data-start={ this.props.paragraph[0].start }
            className={ 'timecode' }
            tabIndex="0"
            >
            { shortTimecode(this.props.paragraph[0].start) }
          </span>
        </Col> */}
        <Grid item xs={12} sm={12} md={9} lg={9} xl={10}>
          {this.props.wordsElements}
        </Grid>
      </Grid>
    );
  }
}
export default Paragraph;
