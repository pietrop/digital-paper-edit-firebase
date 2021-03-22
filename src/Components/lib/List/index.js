import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import SimpleCard from '../SimpleCard';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: '36ch',
    // backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

function ListComponent(props) {
  const classes = useStyles();
  // render() {
  const listItems = props.items
    .map((item) => {
      // const date = `${item.created.toDate().toDateString()} ${item.created.toDate().toLocaleTimeString('en-US')}`;
      if (item.display) {
        return (
          <SimpleCard
            key={item.id}
            id={item.id}
            // date={date}
            title={item.title}
            icon={props.icon}
            description={item.description}
            handleEdit={props.handleEdit}
            handleDelete={props.handleDelete}
            showLinkPath={props.showLinkPath}
          />
        );
      } else {
        return null;
      }
    })
    .filter((item) => {
      return item !== null;
    });

  return (
    <>
      <List
        className={classes.root}
        style={{ height: '75vh', overflow: 'scroll' }}
        // variant="flush"
      >
        {listItems}
      </List>
    </>
  );
  // }
}

export default ListComponent;
