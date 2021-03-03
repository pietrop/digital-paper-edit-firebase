import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import SearchBar from '../SearchBar';
import CustomTranscriptCard from '../CustomTranscriptCard';
import includesText from '../../../Util/includes-text';
import whichJsEnv from '../../../Util/which-js-env';
// TODO: add error handling, eg custom alert if server is not responding
const useStyles = makeStyles((theme) => ({
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
  },
  // fabGreen: {
  //   color: theme.palette.common.white,
  //   backgroundColor: green[500],
  //   '&:hover': {
  //     backgroundColor: green[600],
  //   },
  // },
}));
function ListPageTranscript(props) {
  // constructor(props) {
  // super(props);
  // state = {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const classes = useStyles();
  // };
  // }

  const handleSearch = (searchText) => {
    console.log('searchText', searchText);
    const results = props.items.filter((transcript) => {
      // console.log('transcript', transcript);
      if (
        (transcript.title && includesText(transcript.title, searchText)) ||
        (transcript.description && includesText(transcript.description, searchText)) ||
        (transcript.clipName && includesText(transcript.clipName, searchText)) ||
        (transcript.sttEngine && includesText(transcript.sttEngine, searchText))
      ) {
        transcript.display = true;

        return transcript;
      } else {
        transcript.display = false;

        return transcript;
      }
    });

    props.handleUpdateList(results);
  };

  // render() {
  let itemsCards;
  let description;
  if (props.items) {
    itemsCards = props.items
      .map((item) => {
        if (item.display) {
          return (
            <CustomTranscriptCard
              sttEngine={item.sttEngine}
              clipName={item.clipName}
              languageCode={item.languageCode}
              icon={props.icon}
              key={'key__' + item.id}
              id={item.id}
              projectId={item.id}
              title={item.title}
              handleEdit={props.handleEdit}
              handleDelete={() => {
                props.handleDelete(item.id);
              }}
              // To be able to do REST for cards for - Projects, transcripts, paperedits
              showLink={() => {
                return props.showLinkPath(item.id);
              }}
              status={item.status}
              description={item.description}
              disabled={item.status === 'done' ? true : false}
              errorMessage={item.status === 'error' ? item.errorMessage : null}
            />
          );
        } else {
          return null;
        }
      })
      .filter((item) => {
        return item !== null;
      });
  }

  let content;
  let searchEl;
  // TODO: better error handling
  // eg there should be a loading/fetching? and then if it gets error 404 or 505(?) from server
  // then it displays error from server
  // also add `navigator.onLine` to raise error if offline?

  if (props.items !== null && props.items.length !== 0) {
    searchEl = <SearchBar handleSearch={handleSearch} />;
  }
  if (props.items !== null && props.items.length !== 0) {
    content = (
      <>
        <List
          className={classes.root}
          style={{ height: '75vh', overflow: 'scroll' }}
          // variant="flush"
        >
          {itemsCards}
        </List>
      </>
    );
  } else {
    content = <i>No {props.model}, create a new one to get started </i>;
  }

  return (
    <>
      {/* <Container maxWidth="md"> */}
      <Grid container direction="row" justify="space-around" alignItems="flex-end">
        <Grid item xs={12} sm={6} md={6} ld={6} xl={6}>
          {searchEl}
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <Button fullWidth={true} onClick={props.handleShowCreateNewItemForm} color="primary" block="true">
            New {props.model}
          </Button>
        </Grid>

        <Fab aria-label={'add'} style={{ zIndex: '1' }} className={classes.fab} color={'primary'} onClick={props.handleShowCreateNewItemForm}>
          <AddIcon />
        </Fab>

        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <Button fullWidth={true} onClick={props.handleShowCreateNewBatchForm} color="primary" block="true">
            New Batch {props.model}
          </Button>
        </Grid>
      </Grid>

      {content}
      {/* </Container>     */}
    </>
  );
}

export default ListPageTranscript;
