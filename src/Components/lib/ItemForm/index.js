// https://react-bootstrap.netlify.com/components/forms/#forms-validation
// https://reactjs.org/docs/forms.html

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
//https://material-ui.com/api/form-control/

class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Tmp title text for debugging, remove for production
      // replace with ''
      title: this.props.title,
      description: this.props.description,
      validated: false,
      id: this.props.id,
    };
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    console.log('form.checkValidity()', form.checkValidity());
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    }

    if (form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      const tmpItem = {
        title: this.state.title,
        description: this.state.description,
        id: this.state.id,
      };
      this.props.handleSaveForm(tmpItem);
    }

    //this.setState({ redirect: true, newProjectId: response.projectId });
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  render() {
    return (
      <>
        <div style={{ margin: '1em' }}>
          <form validated={this.state.validated} onSubmit={(e) => this.handleSubmit(e)}>
            <Grid container direction="column" justify="center" alignItems="stretch">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="my-input">Title</InputLabel>
                  <Input
                    fullWidth={true}
                    id="my-input"
                    aria-describedby="my-helper-text"
                    type="text"
                    required
                    placeholder="Enter a project title"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                  />
                  <FormHelperText id="my-helper-text">Chose a title</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="my-input">Description</InputLabel>
                  <Input
                    type="text"
                    placeholder="Enter a project description"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                    fullWidth="true"
                  />
                  <FormHelperText id="my-helper-text">Chose an optional description</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item item xs={12} sm={12} md={12} lg={12}>
                <br />
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </>
    );
  }
}

export default ItemForm;
