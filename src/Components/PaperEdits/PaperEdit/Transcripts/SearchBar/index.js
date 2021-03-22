import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from 'react-select';
import colourStyles from '../LabelsList/select-color-styles.js';
import speakersColorStyles from './select-speakers-color-styles.js';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingFilterOptions: false,
      showParagraphsMatchingSearch: false,
      showTextSearchPreferences: false,
      showSpeakersSearchPreferences: false,
      showLabelsSearchPreferences: false,
    };
  }

  handleSpeakersSearchChange = (selectedOptionSpeakerSearch) => {
    this.props.handleSpeakersSearchChange(selectedOptionSpeakerSearch);
    this.setState({ selectedOptionSpeakerSearch });
  };

  handleLabelsSearchChange = (selectedOptionLabelSearch) => {
    console.log('handleLabelsSearchChange', selectedOptionLabelSearch);
    this.props.handleLabelsSearchChange(selectedOptionLabelSearch);
    this.setState({ selectedOptionLabelSearch });
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

  handleFilterResults = () => {
    this.setState((state) => {
      if (!state.isShowingFilterOptions) {
        this.props.handleShowParagraphsMatchingSearch(true);
        return {
          isShowingFilterOptions: true,
          showTextSearchPreferences: true,
          showSpeakersSearchPreferences: true,
          showLabelsSearchPreferences: true,
          // defaults to show only matching paragraph to be checked
          showParagraphsMatchingSearch: true,
        };
      } else {
        this.props.handleShowParagraphsMatchingSearch(false);
        return {
          isShowingFilterOptions: false,
          showTextSearchPreferences: false,
          showSpeakersSearchPreferences: false,
          showLabelsSearchPreferences: false,
          // remove preferences for showing matching paragraphjs when removing filters
          showParagraphsMatchingSearch: false,
        };
      }
    });
  };

  /* TODO: move searchBar to a Search Toolbar component? */
  render() {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={1} sm={1} md={1} lg={1} lg={1}>
            <SearchOutlinedIcon />
          </Grid>
          <Grid item xs={9} sm={9} md={9} lg={9} lg={9}>
            <Input
              fullWidth={true}
              //  TODO: pass labels, speakers, and paragraph pref
              onChange={(e) => {
                this.props.handleSearch(e, {
                  showParagraphsMatchingSearch: this.state.showParagraphsMatchingSearch,
                  showLabelsSearchPreferences: this.state.showLabelsSearchPreferences,
                  showSpeakersSearchPreferences: this.state.showSpeakersSearchPreferences,
                });
              }}
              placeholder="Search text..."
              aria-label="search"
              aria-describedby="search"
            />
          </Grid>

          <Grid item xs={1} sm={1} md={1} lg={1} lg={1}>
            <Button color="primary" onClick={this.handleFilterResults}>
              <FilterListOutlinedIcon />
            </Button>
          </Grid>
        </Grid>
        <br />
        {this.state.showSpeakersSearchPreferences && (
          <>
            <Grid container>
              <Grid item xs={1} sm={1} md={1} ld={1} xl={1}>
                <PersonOutlinedIcon />
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
          </>
        )}

        {this.state.showLabelsSearchPreferences && (
          <>
            <Grid container spacing={1}>
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
        )}

        {this.state.showTextSearchPreferences && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  type="checkbox"
                  color="primary"
                  checked={this.state.showParagraphsMatchingSearch}
                  onChange={this.handleShowParagraphsMatchingSearch}
                />
              }
              label={<FormHelperText>Show only matching paragraphs</FormHelperText>}
            />
          </>
        )}
      </>
    );
  }
}

export default SearchBar;
