import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import WaveFormChoiceMenu from './WaveFormChoiceMenu';
import ColorOptionsFormGroup from '../../Transcripts/LabelsList/ColorOptionsFormGroup.js';
// import CustomDrawer from './CustomDrawer';
import CustomDrawer from '../../../../lib/CustomDrawer';
function Example(props) {
  const [show, setShow] = useState(false);
  const [waveFormMode, setWaveFormMode] = useState('cline');
  const [waveFormColor, setWaveFormColor] = useState('blue');

  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    props.handleExportAudioPreviewWithVideoWaveform({ waveFormMode, waveFormColor });
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleColorSelectChange = (color) => {
    // this.setState({ color: color });
    console.log('handleColorSelectChange', color);
    setWaveFormColor(color);
  };

  const handleSetWaveFormMode = (mode) => {
    // const mode = e.target.value;
    console.log('handleSetWaveFormMode', mode);

    setWaveFormMode(mode);
  };

  return (
    <>
      <CustomDrawer orientation="right" btn={<Button>{props.text}</Button>}>
        <Card>
          <CardContent>
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item>
                <Typography variant="h5" gutterBottom>
                  Export audio as video waveform
                </Typography>
              </Grid>
              <Grid item>
                <InputLabel shrink>Select waveform style</InputLabel>
                <WaveFormChoiceMenu handleSetWaveFormMode={handleSetWaveFormMode} />
              </Grid>
              <Grid item>
                <img
                  src={require(`./${waveFormMode}.gif`)}
                  alt="loading..."
                  fluid
                  // style={{ width: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
              </Grid>
              <Grid item>
                <ColorOptionsFormGroup color={waveFormColor} handleColorSelectChange={handleColorSelectChange} />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container direction="row" justify="center" alignItems="center">
              {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> */}
              {/* <Grid container direction="row" justify="center" alignItems="flex-end" fullWidth={true}> */}
              {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Button variant="contained" fullWidth={true} onClick={handleClose}>
                  Close
                </Button>
              </Grid> */}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button color="primary" variant="contained" fullWidth={true} onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
              {/* </Grid> */}
              {/* </Grid> */}
            </Grid>
          </CardActions>
        </Card>
        {/* </Modal.Footer> */}
      </CustomDrawer>
    </>
  );
}

export default Example;
