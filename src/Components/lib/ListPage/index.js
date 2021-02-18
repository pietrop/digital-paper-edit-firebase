import React, { useState } from 'react';
import List from '../List';
import includesText from '../../../Util/includes-text/index.js';
import SearchBar from '../SearchBar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  // root: {
  //   backgroundColor: theme.palette.background.paper,
  //   width: 500,
  //   position: 'relative',
  //   minHeight: 200,
  // },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: '1000',
  },
  // fabGreen: {
  //   color: theme.palette.common.white,
  //   backgroundColor: green[500],
  //   '&:hover': {
  //     backgroundColor: green[600],
  //   },
  // },
}));

function Page(props) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const classes = useStyles();

  const handleSearch = searchText => {
    const results = props.items.filter(project => {
      if (includesText(project.title, searchText) || includesText(project.description, searchText)) {
        project.display = true;

        return project;
      } else {
        project.display = false;

        return project;
      }
    });
    props.handleUpdateList(results);
  };

  const handleShowSearchBar = () => {
    setShowSearchInput(!showSearchInput);
    // this.setState(state => {
    //   return { showSearchInput: !state.showSearchInput };
    // });
  };

  // render() {
  let searchEl;
  if (props.items !== null && props.items.length !== 0) {
    searchEl = <SearchBar handleSearch={handleSearch} />;
  }

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="flex-end">
        <Grid item xs={12} sm={10} md={10} ld={10} xl={10}>
          {searchEl}
        </Grid>

        <Grid item xs={12} sm={2} md={2} ld={2} xl={2}>
          <Button onClick={props.handleShowCreateNewItemForm} color="primary" block="true" fullWidth={true}>
            New {props.model}
          </Button>
        </Grid>

        <Fab aria-label={'add'} className={classes.fab} color={'primary'} onClick={props.handleShowCreateNewItemForm}>
          <AddIcon />
        </Fab>
      </Grid>

      {props.items && props.items.length === 0 ? <i>There are no {props.model}, create a new one to get started</i> : null}

      {props.items ? (
        <List
          icon={props.icon}
          items={props.items}
          handleEdit={props.handleEdit}
          handleDelete={props.handleDelete}
          showLinkPath={props.showLinkPath}
        />
      ) : null}
    </>
  );
  // }
}

export default Page;
