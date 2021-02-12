import React, { useState, useEffect } from 'react';
// import Container from 'react-bootstrap/Container';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Tabs from 'react-bootstrap/Tabs';
// import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import CustomBreadcrumb from '../lib/CustomBreadcrumb';
import Transcripts from '../Transcripts';
import PaperEdits from '../PaperEdits';
import ApiWrapper from '../../ApiWrapper/index.js';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Project(props) {
  // constructor(props, context) {
  // super(props, context);
  // this.state = {
  // for use in react-bootstrap tab component
  // key: 'transcripts',
  // projectId: this.props.match.params.projectId,
  // projectName: 'Projects Name',
  // value: 0,
  // };
  const [key, setKey] = useState('transcripts');
  const [projectId, setProjectId] = useState(props.match.params.projectId);
  const [projectName, setProjectName] = useState('Projects Name');
  const [value, setValue] = useState(0);
  // }
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    const result = await ApiWrapper.getProject(projectId);
    if (result) {
      // this.setState({ projectName: result.project.title });
      setProjectName(result.project.title);
    }
  }, []);
  // async componentDidMount() {
  //   // TODO: do we need to add user id in request?
  //   const result = await ApiWrapper.getProject(this.state.projectId);
  //   if (result) {
  //     this.setState({ projectName: result.project.title });
  //   }
  //   // TODO: some error handling
  // }

  // render() {
  // const { value } = this.state;

  return (
    <>
      <Container style={{ marginBottom: '5em', marginTop: '1em' }} maxWidth="md">
        <Grid item sm={12} md={12} ld={12} xl={12}>
          <CustomBreadcrumb
            items={[
              {
                name: 'Projects',
                link: '/projects',
              },
              {
                name: projectName,
              },
            ]}
          />
        </Grid>

        {/* <div className={classes.root}> */}
        <Paper position="static" square>
          <Tabs centered indicatorColor="primary" textColor="primary" value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Transcripts" {...a11yProps(0)} />
            <Tab label="Paper Edits" {...a11yProps(1)} />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <Transcripts projectId={projectId} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PaperEdits projectId={projectId} />
        </TabPanel>
        {/* </div> */}

        {/* <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={key => this.setState({ key })}>
            <Tab eventKey="transcripts" title="Transcripts">
              <Transcripts projectId={this.state.projectId} />
            </Tab>
            <Tab eventKey="paperedits" title="Paper Edits">
              <PaperEdits projectId={this.state.projectId} />
            </Tab>
          </Tabs> */}
      </Container>
      {/* <CustomFooter/> */}
    </>
  );
  // }
}

export default Project;
