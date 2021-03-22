import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

import Select from 'react-select';

import colourStyles from '../LabelsList/select-color-styles.js';
import speakersColorStyles from './select-speakers-color-styles.js';

class SearchBarTranscripts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingFilterOptions: false,
      showParagraphsMatchingSearch: false,
      showTextSearchPreferences: false,
      showSpeakersSearchPreferences: false,
      showLabelsSearchPreferences: false,
      selectedOptionTranscriptSearch: false,
    };
  }

  handleSpeakersSearchChange = (selectedOptionSpeakerSearch) => {
    this.props.handleSpeakersSearchChange(selectedOptionSpeakerSearch);
  };

  handleLabelsSearchChange = (selectedOptionLabelSearch) => {
    this.props.handleLabelsSearchChange(selectedOptionLabelSearch);
  };

  handleShowParagraphsMatchingSearch = () => {
    this.setState(
      (state) => {
        this.props.handleShowParagraphsMatchingSearch(!state.showParagraphsMatchingSearch);
        return { showParagraphsMatchingSearch: !state.showParagraphsMatchingSearch };
      },
      () => {}
    );
  };

  handleTranscriptSearchChange = (selectedOptionTranscriptSearch) => {
    this.props.handleTranscriptSearchChange(selectedOptionTranscriptSearch);
    this.setState({ selectedOptionTranscriptSearch });
  };

  /* TODO: move SearchBarTranscripts to a Search Toolbar component? */
  render() {
    return (
      <>
        <Grid container>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
            <Button
              // block
              variant="light"
              onClick={this.props.handleShowAdvancedSearchViewSearchingAcrossTranscripts}
              title={'close search across transcript in a project'}
            >
              <ArrowBackIosOutlinedIcon />
            </Button>
          </Grid>
          <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={11} sm={11} md={11} ld={11} xl={11}>
                <Input
                  fullWidth={true}
                  //  TODO: pass labels, speakers, and paragraph pref
                  onChange={(e) => {
                    this.props.handleSearch(e, {
                      showParagraphsMatchingSearch: this.state.showParagraphsMatchingSearch,
                      showLabelsSearchPreferences: this.state.showLabelsSearchPreferences,
                      showSpeakersSearchPreferences: this.state.showSpeakersSearchPreferences,
                      selectedOptionTranscriptSearch: this.state.selectedOptionTranscriptSearch,
                    });
                  }}
                  value={this.props.searchValue}
                  placeholder="Search text..."
                  aria-label="search"
                  aria-describedby="search"
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
                <SearchOutlinedIcon />
              </Grid>
            </Grid>
            <br />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
            <DescriptionOutlinedIcon />
          </Grid>
          <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
            <Select
              value={this.state.selectedOptionTranscriptSearch}
              onChange={this.handleTranscriptSearchChange}
              isMulti
              isSearchable
              options={this.props.transcriptOptions}
              styles={speakersColorStyles}
              placeholder={'Choose transcripts to search...'}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
            <PersonOutlineOutlinedIcon />
          </Grid>
          <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
            <Select
              value={this.state.selectedOptionSpeakerSearch}
              onChange={this.handleSpeakersSearchChange}
              isMulti
              isSearchable
              options={this.props.speakersOptions}
              styles={speakersColorStyles}
              placeholder={'Filter by speakers...'}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
            <LocalOfferOutlinedIcon />
          </Grid>
          <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
            <Select
              value={this.state.selectedOptionLabelSearch}
              onChange={this.handleLabelsSearchChange}
              isMulti
              isSearchable
              options={this.props.labelsOptions}
              styles={colourStyles}
              placeholder={'Filter by labels...'}
            />
          </Grid>
        </Grid>
        <br />
      </>
    );
  }
}

export default SearchBarTranscripts;
