import React, { Component, Suspense } from 'react';
// import Container from 'react-bootstrap/Container';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ButtonGroup from '@material-ui/core/ButtonGroup';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Skeleton from '@material-ui/lab/Skeleton';

import CustomBreadcrumb from '../../lib/CustomBreadcrumb/index.js';
import ApiWrapper from '../../../ApiWrapper/index.js';

const Transcripts = React.lazy(() => import('./Transcripts/index.js'));
const ProgramScript = React.lazy(() => import('./ProgramScript/index.js'));

class PaperEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.match.params.projectId,
      papereditId: this.props.match.params.papereditId,
      projectTitle: '',
      programmeTitle: '',
      transcripts: [],
      labelsOptions: [],
      isTranscriptsShown: true,
      isProgramScriptShown: true,
      // annotations:[]
    };
  }

  componentDidMount = async () => {
    try {
      ApiWrapper.getProgrammeScriptAndTranscripts(this.state.projectId, this.state.papereditId).then((json) => {
        console.log('componentDidMount - json getProgrammeScriptAndTranscripts', json);
        console.log('projectTitle', json.project.title);
        this.setState({
          programmeTitle: json.programmeScript.title,
          projectTitle: json.project.title,
          transcripts: json.transcripts,
          labelsOptions: json.labels,
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  toggleTranscripts = () => {
    if (this.state.isProgramScriptShown) {
      this.setState((state) => {
        return {
          isTranscriptsShown: !state.isTranscriptsShown,
        };
      });
    }
  };

  toggleProgramScript = () => {
    if (this.state.isTranscriptsShown) {
      this.setState((state) => {
        return {
          isProgramScriptShown: !state.isProgramScriptShown,
        };
      });
    }
  };

  render() {
    return (
      <Container
        style={
          {
            //  backgroundColor: '#eee'
          }
        }
        fluid
      >
        <Grid container>
          <Grid item xs={12} sm={8} md={8} ld={8} xl={8}>
            <CustomBreadcrumb
              backgroundColor={'transparent'}
              items={[
                {
                  name: 'Projects',
                  link: 'projects',
                },
                {
                  name: `Project: ${this.state.projectTitle}`,
                  link: `projects/${this.state.projectId}`,
                },
                {
                  name: 'PaperEdits',
                },
                {
                  name: `${this.state.programmeTitle}`,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} ld={4} xl={4}>
            <div className="d-flex flex-column">
              <ButtonGroup className="mt-2" size="md" block color="primary" aria-label="outlined primary button group">
                <Button onClick={this.toggleTranscripts} variant={'light'} size="sm">
                  Transcripts {this.state.isTranscriptsShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Button>
                <Button onClick={this.toggleProgramScript} variant={'light'} size="sm">
                  Program Script {this.state.isProgramScriptShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Button>
              </ButtonGroup>
            </div>
          </Grid>
        </Grid>

        <Container fluid={true}>
          <Grid container>
            <Grid
              item
              xs={{ span: 12, offset: 0 }}
              sm={{
                span: this.state.isProgramScriptShown ? 7 : 12,
                offset: this.state.isProgramScriptShown ? 0 : 0,
              }}
              md={{
                span: this.state.isProgramScriptShown ? 7 : 12,
                offset: this.state.isProgramScriptShown ? 0 : 0,
              }}
              lg={{
                span: this.state.isProgramScriptShown ? 7 : 10,
                offset: this.state.isProgramScriptShown ? 0 : 1,
              }}
              xl={{
                span: this.state.isProgramScriptShown ? 7 : 10,
                offset: this.state.isProgramScriptShown ? 0 : 1,
              }}
              style={{ display: this.state.isTranscriptsShown ? 'block' : 'none' }}
            >
              <div className={['d-block', 'd-sm-none'].join(' ')}>
                <br />
              </div>
              <Suspense
                fallback={
                  <Grid container>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <Skeleton variant="rect" width={'100%'} height={634} />
                    </Grid>
                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                      <Skeleton variant="rect" width={'100%'} height={634} />
                    </Grid>
                  </Grid>
                }
              >
                {this.state.transcripts.length ? (
                  <Transcripts projectId={this.state.projectId} transcripts={this.state.transcripts} labelsOptions={this.state.labelsOptions} />
                ) : (
                  <>
                    <Grid container>
                      <Grid item>
                        <Skeleton variant="rect" width={'100%'} height={634} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Suspense>
            </Grid>
            <Grid
              item
              xs={{ span: 12, offset: 0 }}
              sm={{
                span: this.state.isTranscriptsShown ? 5 : 12,
                offset: this.state.isTranscriptsShown ? 0 : 0,
              }}
              md={{
                span: this.state.isTranscriptsShown ? 5 : 12,
                offset: this.state.isTranscriptsShown ? 0 : 0,
              }}
              lg={{
                span: this.state.isTranscriptsShown ? 5 : 10,
                offset: this.state.isTranscriptsShown ? 0 : 1,
              }}
              xl={{
                span: this.state.isTranscriptsShown ? 5 : 8,
                offset: this.state.isTranscriptsShown ? 0 : 2,
              }}
              style={{ display: this.state.isProgramScriptShown ? 'block' : 'none' }}
            >
              <Suspense
                fallback={
                  <>
                    <Grid container>
                      <Skeleton variant="rect" width={'100%'} height={200} />
                    </Grid>
                    <br />
                    <Grid container>
                      <Grid item>
                        <Skeleton variant="rect" width={'100%'} height={30} />
                      </Grid>
                      <Grid item>
                        <Skeleton variant="rect" width={'100%'} height={30} />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container>
                      <Grid item>
                        <Skeleton variant="rect" width={'100%'} height={30} />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container>
                      <Skeleton variant="rect" width={'100%'} height={300} />
                    </Grid>
                  </>
                }
              >
                <ProgramScript projectId={this.state.projectId} papereditId={this.state.papereditId} transcripts={this.state.transcripts} />
              </Suspense>
            </Grid>
          </Grid>
        </Container>
      </Container>
    );
  }
}

export default PaperEdit;
