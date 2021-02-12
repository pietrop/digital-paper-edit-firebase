import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
    marginTop: '1em',
    marginBottom: '1em',
  },
  media: {
    height: 140,
  },
});

const SimpleCard = props => {
  const classes = useStyles();

  const handleDelete = () => {
    //eslint-disable-next-line
    const confirmationPrompt = confirm("Click OK if you wish to delete, cancel if you don't");
    if (confirmationPrompt === true) {
      if (props.handleDelete) {
        props.handleDelete(props.id);
      }
    } else {
      alert('All is good, it was not deleted');
    }
  };

  const handleEdit = () => {
    props.handleEdit(props.id);
  };
  const showLinkPath = () => {
    return props.showLinkPath(props.id);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardActions>
          <Grid container container direction="row" justify="space-between" alignItems="flex-start">
            <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
              <Typography gutterBottom variant="h5" component="h2" color="textSecondary" noWrap title={props.title}>
                <Link href={`#${showLinkPath()}`}>
                  {props.icon} {props.title}
                </Link>
              </Typography>
            </Grid>
            <Grid item s={12} sm={3} md={3} lg={3} xl={3}>
              <Grid container direction="row" justify="flex-end" alignItems="flex-start">
                <Grid item>
                  <IconButton size="small" color="primary" onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton size="small" color="primary" onClick={handleDelete}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardActions>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
          {/* <Typography variant="p" gutterBottom>
            Created {props.date}
          </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleCard;
