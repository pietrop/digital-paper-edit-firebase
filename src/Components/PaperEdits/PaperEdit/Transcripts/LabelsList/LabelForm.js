import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import chroma from 'chroma-js';
import ColorOptionsFormGroup from './ColorOptionsFormGroup.js';

class LabelForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      color: this.props.color,
      label: this.props.label,
      description: this.props.description,
      labelId: this.props.labelId,
    };
  }
  handleColorSelectChange = (color) => {
    this.setState({ color: color });
  };

  handleSave = () => {
    // checks color in color picker input is valid - can be color name in letters or hex
    if (chroma.valid(this.state.color)) {
      // checks label name is not empty
      if (this.state.label !== '') {
        this.props.onLabelSaved({
          value: this.state.color,
          label: this.state.label,
          color: this.state.color,
          description: this.state.description,
          id: this.state.labelId,
        });

        this.props.handleClose();
      } else {
        alert('add a name to the label to be able to save');
      }
    } else {
      alert('choose a valid color');
    }
  };

  render() {
    return (
      <>
        <form>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl controlId="formGroupEmail" fullWidth={true}>
                <InputLabel>Label Name </InputLabel>
                <Input
                  fullWidth={true}
                  type="text"
                  placeholder="Enter label name"
                  defaultValue={this.state.label}
                  onInput={(e) => {
                    this.setState({ label: e.target.value });
                  }}
                />
                <FormHelperText className="text-muted">Required label name</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl controlId="formGroupPassword" fullWidth={true}>
                <InputLabel>Label Description</InputLabel>
                <Input
                  fullWidth={true}
                  type="text"
                  placeholder="Enter label description"
                  defaultValue={this.state.description}
                  as="textarea"
                  rows="3"
                  onInput={(e) => {
                    this.setState({ description: e.target.value });
                  }}
                />
                <FormHelperText className="text-muted">Optional label description</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <ColorOptionsFormGroup color={this.props.color} handleColorSelectChange={this.handleColorSelectChange} />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <br />
              <br />
              <Button variant="contained" color="primary" onClick={this.handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </>
    );
  }
}
export default LabelForm;
