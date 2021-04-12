import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import WarningIcon from '@material-ui/icons/Warning';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import Transcript from './Transcript.js';
import SearchBarTranscripts from './SearchBarTranscripts/index.js';
import onlyCallOnce from '../../../../Util/only-call-once/index.js';
import makeListOfUniqueSpeakers from './makeListOfUniqueSpeakers.js';
import Paragraphs from './Paragraphs/index.js';

// move as separate component
// https://material-ui.com/components/tabs/#vertical-tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

//  const classes = useStyles();

class Transcripts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      sentenceToSearchCSS: '',
      sentenceToSearchCSSInHighlights: '',
      selectedOptionLabelSearch: [],
      selectedOptionSpeakerSearch: [],
      selectedOptionTranscriptsSearch: [],
      showParagraphsMatchingSearch: false,
      showAdvancedSearchViewSearchingAcrossTranscripts: false,
      tabValue: 0,
    };
  }

  // New
  handleSearch = (e, searchPreferences) => {
    console.log('Transcripts:: SEARCH:::', e.target.value, searchPreferences);
    // TODO: debounce to optimise
    if (e.target.value !== '') {
      const searchString = e.target.value;
      this.setState({ searchString: searchString.toLowerCase() });
      //  "debounce" to optimise
      // TODO: re introduce this
      onlyCallOnce(this.highlightWords(searchString), 500);
    }
    // if empty string reset
    else if (e.target.value === '') {
      this.setState({
        sentenceToSearchCSS: '',
        searchString: '',
      });
    }
  };
  highlightWords = (searchString) => {
    const listOfSearchWords = searchString.toLowerCase().trim().split(' ');
    const pCSS = `.paragraph[data-paragraph-text*="${listOfSearchWords.join(' ')}"]`;

    const wordsToSearchCSS = listOfSearchWords.map((searchWord, index) => {
      let res = `${pCSS} > div > span.words[data-text="${searchWord.toLowerCase().trim()}"]`;
      if (index < listOfSearchWords.length - 1) {
        res += ', ';
      }

      return res;
    });
    // Need to add an extra span to search annotation hilights
    // TODO: refactor to make more DRY
    const wordsToSearchCSSInHighlights = listOfSearchWords.map((searchWord, index) => {
      let res = `${pCSS} > div  > span >span.words[data-text="${searchWord.toLowerCase().trim()}"]`;
      if (index < listOfSearchWords.length - 1) {
        res += ', ';
      }

      return res;
    });
    this.setState({
      sentenceToSearchCSS: wordsToSearchCSS.join(' '),
      sentenceToSearchCSSInHighlights: wordsToSearchCSSInHighlights.join(' '),
    });
  };

  // To search across all transcripts
  handleLabelsSearchChange = (selectedOptionLabelSearch) => {
    this.setState({
      selectedOptionLabelSearch,
    });
  };
  // To search across all transcripts
  handleSpeakersSearchChange = (selectedOptionSpeakerSearch) => {
    this.setState({
      selectedOptionSpeakerSearch,
    });
  };
  // To search across all transcripts
  handleTranscriptSearchChange = (selectedOptionTranscriptsSearch) => {
    this.setState({
      selectedOptionTranscriptsSearch,
    });
  };
  // To search across all transcripts
  handleShowParagraphsMatchingSearch = (isShowParagraphsMatchingSearch) => {
    this.setState({ showParagraphsMatchingSearch: isShowParagraphsMatchingSearch });
  };

  // TODO: Not yet implemented - low priority
  handleWordClick = (e) => {
    if (e.target.className === 'words') {
      const wordEl = e.target;
      console.log('wordEl', wordEl);
      // this.videoRef.current.currentTime = wordEl.dataset.start;
      // this.videoRef.current.play();
    }
  };

  handleFilterResults = () => {
    console.log('handleFilterResults');
    this.setState({
      searchString: '',
      sentenceToSearchCSS: '',
      sentenceToSearchCSSInHighlights: '',
      selectedOptionLabelSearch: [],
      selectedOptionSpeakerSearch: [],
      selectedOptionTranscriptsSearch: [],
    });
  };

  handleTabChange = (event, newValue) => {
    console.log('handleChange', newValue);
    this.setState({ tabValue: newValue });
  };

  handleShowAdvancedSearchViewSearchingAcrossTranscripts = () => {
    this.setState((prevState) => {
      if (!prevState.showAdvancedSearchViewSearchingAcrossTranscripts) {
        return {
          showAdvancedSearchViewSearchingAcrossTranscripts: true,
          // in this advanced search view - when searchign across paragraphs always show paragraphs matching searches
          // which means segmenting transcript to show only paragraphs that metch serching criteria
          showParagraphsMatchingSearch: true,
        };
      } else {
        return {
          showAdvancedSearchViewSearchingAcrossTranscripts: false,
          // in this advanced search view - when searchign across paragraphs always show paragraphs matching searches
          // which means segmenting transcript to show only paragraphs that metch serching criteria
          showParagraphsMatchingSearch: false,
          // reset search if closing view
          selectedOptionLabelSearch: [],
          selectedOptionSpeakerSearch: [],
          selectedOptionTranscriptsSearch: [],
        };
      }
    });
  };

  // eslint-disable-next-line class-methods-use-this
  render() {
    const transcriptsElNav = this.props.transcripts.map((transcript, index) => {
      // Note: that if there are transcripts in progress, current setup
      // won't show when they are done in this view
      // only in project's view list of transcript you get a UI update when they are done
      return (
        <Tab
          key={transcript.id}
          label={
            <>
              {transcript.status === 'in-progress' ? <QueryBuilderIcon /> : ''}
              {(transcript.status !== 'done' && transcript.status !== 'in-progress') ||
              transcript.status === 'error' ? (
                <WarningIcon />
              ) : (
                ''
              )}
              {`  ${transcript.transcriptTitle}`}
            </>
          }
          {...a11yProps(index)}
          disabled={transcript.status !== 'done' ? true : false}
        />
      );
    });
    // id - value - label - color - description
    // const transcriptOptions = [{value: 'test', label: 'test'}];
    const transcriptsOptions = this.props.transcripts
      .map((transcript) => {
        if (transcript.id && transcript.transcriptTitle) {
          return {
            id: transcript.id,
            value: transcript.id,
            label: transcript.transcriptTitle,
            description: transcript.description,
            status: transcript.status,
          };
        } else {
          return {
            status: transcript.status,
          };
        }
      }) // Filter to show only transcripts that are done. excluding in progress and errored
      .filter((transcript) => {
        return transcript.status === 'done';
      });

    const transcriptsUniqueListOfSpeakers2D = this.props.transcripts.map((transcript) => {
      if (transcript.transcript && transcript.transcript.paragraphs) {
        return makeListOfUniqueSpeakers(transcript.transcript.paragraphs);
      } else {
        return { value: 'test', label: 'test' };
      }
    });
    const transcriptsUniqueListOfSpeakers = transcriptsUniqueListOfSpeakers2D.reduce(function (
      prev,
      curr
    ) {
      return prev.concat(curr);
    });
    // remove duplicates
    function removeDuplicates(array) {
      //  https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
      return Array.from(new Set(array.map(JSON.stringify))).map(JSON.parse);
    }
    const transcriptsUniqueListOfSpeakersNoDuplicates = removeDuplicates(
      transcriptsUniqueListOfSpeakers
    );

    /* TODO: Will this work? */
    const searchBarTranscriptsElement = (
      <SearchBarTranscripts
        labelsOptions={this.props.labelsOptions}
        speakersOptions={transcriptsUniqueListOfSpeakersNoDuplicates}
        handleSearch={this.handleSearch}
        searchValue={this.state.searchString}
        handleLabelsSearchChange={this.handleLabelsSearchChange}
        handleSpeakersSearchChange={this.handleSpeakersSearchChange}
        handleShowParagraphsMatchingSearch={this.handleShowParagraphsMatchingSearch}
        transcriptOptions={transcriptsOptions}
        handleTranscriptSearchChange={this.handleTranscriptSearchChange}
        handleFilterResults={this.handleFilterResults}
        handleShowAdvancedSearchViewSearchingAcrossTranscripts={
          this.handleShowAdvancedSearchViewSearchingAcrossTranscripts
        }
      />
    );

    const transcriptsElTab = this.props.transcripts.map((transcript, index) => {
      return (
        <TabPanel key={transcript.id} value={this.state.tabValue} index={index}>
          <Transcript
            status={transcript.status}
            projectId={this.props.projectId}
            transcriptId={transcript.id}
            labelsOptions={this.props.labelsOptions}
            title={transcript.transcriptTitle}
            transcript={transcript.transcript}
            url={transcript.url}
          />
        </TabPanel>
      );
    });

    const searchedParagraphsAcrossTranscripts = this.props.transcripts.map((transcript, index) => {
      if (
        transcript.transcript &&
        this.state.selectedOptionTranscriptsSearch.find((t) => {
          return transcript.id === t.id;
        })
      ) {
        return (
          <Paragraphs
            labelsOptions={this.props.labelsOptions}
            annotations={transcript.annotations ? transcript.annotations : []}
            transcriptJson={transcript.transcript}
            searchString={this.state.searchString ? this.state.searchString : ''}
            showParagraphsMatchingSearch={this.state.showParagraphsMatchingSearch}
            selectedOptionLabelSearch={
              this.state.selectedOptionLabelSearch ? this.state.selectedOptionLabelSearch : []
            }
            selectedOptionSpeakerSearch={
              this.state.selectedOptionSpeakerSearch ? this.state.selectedOptionSpeakerSearch : []
            }
            transcriptId={transcript.id}
            handleTimecodeClick={this.handleTimecodeClick}
            // TODO: these attributes below have not been implemented - low priority
            // handleWordClick={ ()=>{alert('not implemented in this view, switch to individual transcript')}}
            handleWordClick={this.handleWordClick}
            // handleDeleteAnnotation={ this.handleDeleteAnnotation }
            handleDeleteAnnotation={() => {
              alert('not implemented in this view, switch to individual transcript');
            }}
            // handleEditAnnotation={ this.handleEditAnnotation }
            handleEditAnnotation={() => {
              alert('not implemented in this view, switch to individual transcript');
            }}
          />
        );
      } else {
        return null;
      }
    });

    return (
      <>
        <Container disableGutters={true}>
          <style scoped>
            {/* This is to style of the Paragraph component programmatically */}
            {`${
              this.state.sentenceToSearchCSS
            } { background-color: ${'yellow'}; text-shadow: 0 0 0.01px black }`}
            {`${
              this.state.sentenceToSearchCSSInHighlights
            } { background-color: ${'yellow'}; text-shadow: 0 0 0.01px black }`}
          </style>
          <Grid container disableGutters={true}>
            <Grid
              item
              xs={12}
              sm={!this.state.showAdvancedSearchViewSearchingAcrossTranscripts ? 4 : 0}
            >
              {!this.state.showAdvancedSearchViewSearchingAcrossTranscripts ? (
                <>
                  <Button
                    onClick={this.handleShowAdvancedSearchViewSearchingAcrossTranscripts}
                    variant={'light'}
                    block
                    title={'Search across transcripts in this project'}
                    size={'sm'}
                    fullWidth={true}
                    title={"Search across this project's transcripts "}
                  >
                    <SearchOutlinedIcon /> <DescriptionOutlinedIcon />
                    {/* Project's Transcripts */}
                  </Button>
                  <hr />
                  <div style={{ height: '20vh' }}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={this.state.tabValue}
                      onChange={this.handleTabChange}
                      aria-label="Vertical tabs example"
                      // className={classes.tabs}
                    >
                      {transcriptsElNav}
                    </Tabs>
                  </div>
                </>
              ) : null}
            </Grid>

            <Grid item sm={!this.state.showAdvancedSearchViewSearchingAcrossTranscripts ? 8 : 12}>
              {this.state.showAdvancedSearchViewSearchingAcrossTranscripts ? (
                <>
                  {' '}
                  {searchBarTranscriptsElement}
                  <section
                    style={{
                      height: '80vh',
                      overflow: 'auto',
                      border: 'solid',
                      borderWidth: '0.01em',
                      borderColor: 'lightgrey',
                    }}
                  >
                    {searchedParagraphsAcrossTranscripts}
                  </section>
                </>
              ) : (
                <>{transcriptsElTab}</>
              )}
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default Transcripts;
