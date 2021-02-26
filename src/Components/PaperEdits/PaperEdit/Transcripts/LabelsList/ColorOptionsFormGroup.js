import React, { useState } from 'react';
import { colorNamesList, randomColor } from './css-color-names.js';
import chroma from 'chroma-js';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import Typography from '@material-ui/core/Typography';
import { GithubPicker } from 'react-color';

function ColorOptionsFormGroup(props) {
  // Declare a new state variable, which we'll call "count"
  const [color, setColor] = useState(props.color);

  const handleSetColor = (color) => {
    console.log('handleSetColor', color);
    setColor(color);
    props.handleColorSelectChange(color);
  };

  const handleRandomiseColor = () => {
    const tmpColor = randomColor();
    handleSetColor(tmpColor);
  };

  const handleColorPickerChangeComplete = (color) => {
    const tmpColor = chroma(color.hex).name();
    handleSetColor(tmpColor);
  };

  const handleManualColorChange = (e) => {
    if (e && e.target && e.target.value) {
      const colorValue = e.target.value;
      const tmpColor = chroma.valid(colorValue) ? chroma(colorValue).name() : colorValue;
      handleSetColor(tmpColor);
    } else if (e && e.target && e.target.value === '') {
      handleSetColor('');
    }
  };

  return (
    <FormControl controlId="formGroupPassword">
      <Typography variant="subtitle1" gutterBottom>
        Color
      </Typography>
      <Grid container>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          <Button onClick={handleRandomiseColor} color="primary" size="sm">
            <CachedOutlinedIcon />
          </Button>
        </Grid>
        <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
          <Input value={color} type="text" placeholder="#" onChange={handleManualColorChange} />
        </Grid>
        <Grid
          item
          xs={2}
          sm={2}
          md={2}
          lg={2}
          xl={2}
          style={{
            backgroundColor: color,
            border: 'solid',
            borderWidth: '0.01em',
            borderColor: 'grey',
            padding: '1em',
          }}
        ></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormHelperText className="text-muted">
            To pick a color you can chose one at random, pick one form the list below, or type the name or hex code above.
          </FormHelperText>
          <GithubPicker
            width={'100%'}
            color={color}
            triangle={'hide'}
            onChangeComplete={handleColorPickerChangeComplete}
            //   https://casesandberg.github.io/react-color/
            colors={colorNamesList}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
}

export default ColorOptionsFormGroup;
