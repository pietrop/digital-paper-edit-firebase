import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchInput: false,
    };
  }

  handleSearch = (e) => {
    const searchText = e.target.value;
    this.props.handleSearch(searchText);
  };

  handleShowSearchBar = () => {
    console.log('handleShowSearchBar');
    this.setState((state) => {
      return { showSearchInput: !state.showSearchInput };
    });
  };

  render() {
    return (
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <SearchIcon />
        </Grid>
        <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
          <TextField id="input-with-icon-grid" label="Search" onChange={this.handleSearch} fullWidth={true} margin="normal" />
        </Grid>
      </Grid>
    );
  }
}

export default SearchBar;
