import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchInput: false,
    };
  }

  handleSearch = e => {
    const searchText = e.target.value;
    this.props.handleSearch(searchText);
  };

  handleShowSearchBar = () => {
    console.log('handleShowSearchBar');
    this.setState(state => {
      return { showSearchInput: !state.showSearchInput };
    });
  };

  render() {
    return (
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          {/* <Button variant="outlined" onClick={this.handleShowSearchBar}> */}
          <SearchIcon />
          {/* </Button> */}
        </Grid>
        <Grid item xs={10} sm={11} md={11} ld={11} xl={11}>
          {/* <Collapse in={this.showSearchInput}> */}
          <TextField id="input-with-icon-grid" label="Search" onChange={this.handleSearch} fullWidth={true} margin="normal" />
          {/* </Collapse> */}
        </Grid>
      </Grid>
    );
  }
}

export default SearchBar;
