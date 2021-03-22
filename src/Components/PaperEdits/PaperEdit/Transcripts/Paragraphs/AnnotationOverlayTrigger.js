import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Popover from 'react-bootstrap/Popover';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// TODO: figure out how to overlays popover in material UI
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faStickyNote, faTrashAlt, faTag } from '@fortawesome/free-solid-svg-icons';

class AnnotationOverlayTrigger extends Component {
  handleEditAnnotation = () => {
    let text;
    this.props.handleEditAnnotation(this.props.annotationId, text);
  };

  render() {
    // console.log('render - AnnotationOverlayTrigger - props', this.props);
    // const { annotationLabelId } = this.props;
    let overlayContent;
    // handling edge case when labels are not available
    if (this.props.labelsOptions) {
      let label = this.props.labelsOptions.find((label) => {
        return label.id === this.props.annotationLabelId;
      });
      // console.log('label:: ', label, annotationLabelId, this.props.labelsOptions, 'this.props.words', this.props.words, this.props.annotationNote);
      // TODO: Quick fix - needs digging into why sometimes adding a new label crashes, and the `find` function above returns undefined
      if (!label) {
        label = this.props.labelsOptions[0];
      }

      overlayContent = (
        <OverlayTrigger
          rootClose={true}
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="popover-basic" style={{ padding: '1em', width: '200px' }}>
              <Paper>
                <Card>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={2} sm={2} md={2} ld={2} xl={2} style={{ backgroundColor: label.color, marginLeft: '1em' }}></Grid>
                      <Grid item xs={8} sm={8} md={8} ld={8} xl={8}>
                        <FontAwesomeIcon icon={faTag} /> {label.label}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        md={2}
                        ld={2}
                        xl={2}
                        style={{ marginRight: '1em' }}
                        onClick={() => {
                          this.props.handleDeleteAnnotation(this.props.annotationId);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Grid>
                    </Grid>
                    <hr />
                    <FontAwesomeIcon icon={faStickyNote} onClick={this.handleEditAnnotation} /> {this.props.annotationNote}
                    <br />
                    <FontAwesomeIcon icon={faPen} onClick={this.handleEditAnnotation} />
                  </CardContent>
                </Card>
              </Paper>
            </Popover>
          }
        >
          <span style={{ borderBottom: `0.1em ${label.color} solid` }} className={'highlight'}>
            {this.props.words}
          </span>
        </OverlayTrigger>
      );
    }

    return <>{overlayContent}</>;
  }
}

export default AnnotationOverlayTrigger;
