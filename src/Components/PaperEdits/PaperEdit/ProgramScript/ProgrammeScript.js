import React, { Component, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import VoiceOver from './VoiceOver';
import PaperCut from './PaperCut';
import TitleHeading from './TitleHeading';
import Note from './Note';

import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import RecordVoiceOverOutlinedIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import MicIcon from '@material-ui/icons/Mic';
import TitleIcon from '@material-ui/icons/Title';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import VerticalAlignBottomOutlinedIcon from '@material-ui/icons/VerticalAlignBottomOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DragHandleOutlinedIcon from '@material-ui/icons/DragHandleOutlined';
import KeyboardTabOutlinedIcon from '@material-ui/icons/KeyboardTabOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const InsertPoint = ({ text }) => (
  <span style={{ width: '100%', backgroundColor: 'orange', color: '#f9f9f9' }}>
    <KeyboardArrowRightOutlinedIcon /> {text}{' '}
  </span>
);

const DragHandle = sortableHandle(() => (
  <span style={{ cursor: 'move' }}>
    <DragHandleOutlinedIcon />
  </span>
));

const sharedStyle = {
  border: 'none',
  width: '100%',
  marginTop: '0.75em',
  height: '0.1em',
  backgroundColor: 'lightgrey',
};

const SortableItem = sortableElement(
  ({
    indexNumber,
    value,
    type,
    handleDelete,
    handleEdit,
    handleAddTranscriptElementToProgrammeScript,
    handleAddTranscriptSelectionToProgrammeScriptTmpSave,
    handleChangeInsertPointPosition,
  }) => {
    const [isContextMenuVisible, setContextMenuVisibility] = useState(false);

    const [customStyle, setStyle] = useState({
      ...sharedStyle,
      // backgroundColor: '#f9f9f9',
      backgroundColor: 'transparent',
    });

    const handleContextMenu = (event) => {
      event.preventDefault();
      setContextMenuVisibility(true);
    };

    const handleAddTranscriptSelectionToProgrammeScript = (indexNumber) => {
      handleAddTranscriptSelectionToProgrammeScriptTmpSave(indexNumber);
    };

    return (
      <li
        style={
          {
            //  borderStyle: 'dashed',
            // borderWidth: '0.01em',
            // borderColor: 'lightgray',
            // padding: '1.5em'
          }
        }
      >
        <Grid container>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1} style={{ backgroundColor: type === 'insert-point' ? 'orange' : '' }}>
            <DragHandle />
          </Grid>
          <Grid item xs={8} sm={9} md={9} ld={9} xl={9} style={{ backgroundColor: type === 'insert-point' ? 'orange' : '' }}>
            {value}
          </Grid>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1} style={{ backgroundColor: type === 'insert-point' ? 'orange' : '' }}>
            {/* TODO: if paper-cut  then don't show edit/pen icon */}
            {type !== 'paper-cut' && type !== 'insert-point' ? (
              <EditOutlinedIcon
                onClick={() => {
                  handleEdit(indexNumber);
                }}
              />
            ) : null}
          </Grid>
          <Grid item xs={1} sm={1} md={1} ld={1} xl={1} style={{ backgroundColor: type === 'insert-point' ? 'orange' : '' }}>
            {/* TODO: pass a prop to remove element from list */}
            {type !== 'insert-point' ? (
              <>
                <DeleteOutlineOutlinedIcon
                  onClick={() => {
                    handleDelete(indexNumber);
                  }}
                />
                {/* // <FontAwesomeIcon
              //   className={'text-muted'}
              //   style={{ cursor: 'pointer' }}
              //   icon={faTrash}
              //   onClick={() => {
              //     handleDelete(indexNumber);
              //   }}
              // /> */}
              </>
            ) : null}
            {type === 'insert-point' ? <KeyboardArrowLeftOutlinedIcon style={{ color: 'white' }} /> : null}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <Grid container>
              {isContextMenuVisible ? (
                <ButtonGroup
                  color="primary"
                  // variant="contained"
                  aria-label="outlined primary button group"
                  size="sm"
                  block
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                    // border:'solid 0.06em lightgrey',
                    // paddingBottom: '0.01em'
                  }}
                >
                  <Button
                    onClick={() => {
                      setContextMenuVisibility(false);
                    }}
                  >
                    {/* <FontAwesomeIcon icon={faTimes} /> */}
                    <CloseOutlinedIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddTranscriptSelectionToProgrammeScript(indexNumber);
                      setContextMenuVisibility(false);
                    }}
                  >
                    <FileCopyOutlinedIcon />
                    {/* <FontAwesomeIcon icon={faPaste} /> */}
                    Paste Selection
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddTranscriptElementToProgrammeScript('title', indexNumber);
                      setContextMenuVisibility(false);
                    }}
                  >
                    {/* <FontAwesomeIcon icon={faHeading} /> */}
                    <TitleIcon />
                    Heading
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddTranscriptElementToProgrammeScript('voice-over', indexNumber);
                      setContextMenuVisibility(false);
                    }}
                  >
                    {/* <FontAwesomeIcon icon={faMicrophoneAlt} /> */}
                    <MicIcon />
                    Voice over
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddTranscriptElementToProgrammeScript('note', indexNumber);
                      setContextMenuVisibility(false);
                    }}
                  >
                    <NoteOutlinedIcon />
                    {/* <FontAwesomeIcon icon={faStickyNote} /> */}
                    Note
                  </Button>
                  <Button
                    onClick={() => {
                      handleChangeInsertPointPosition(indexNumber);
                      setContextMenuVisibility(false);
                    }}
                    title={'move insert point'}
                  >
                    Move insert Point
                    {/* <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} /> */}
                    <VerticalAlignBottomOutlinedIcon />
                  </Button>
                </ButtonGroup>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={1}
            sm={1}
            md={1}
            ld={1}
            xl={1}
            style={{ cursor: 'context-menu' }}
            onMouseOver={() => {
              setStyle({
                ...sharedStyle,
                backgroundColor: 'lightgrey',
              });
            }}
            onMouseLeave={() => {
              setStyle({
                ...sharedStyle,
                backgroundColor: 'transparent',
                // backgroundColor: '#f9f9f9'
              });
            }}
            onClick={handleContextMenu}
          >
            {customStyle.backgroundColor === 'lightgrey' ? <span style={{ color: 'grey' }}>{'+'}</span> : null}
          </Grid>
          <Grid
            item
            xs={11}
            sm={11}
            md={11}
            ld={11}
            xl={11}
            style={{ cursor: 'context-menu' }}
            onMouseOver={() => {
              setStyle({
                ...sharedStyle,
                backgroundColor: 'lightgrey',
              });
            }}
            onMouseLeave={() => {
              setStyle({
                ...sharedStyle,
                backgroundColor: 'transparent',
                //  backgroundColor: '#f9f9f9'
              });
              // setContextMenuVisibility(false);
            }}
            onClick={handleContextMenu}
          >
            <div className={'insertDiv'} style={customStyle}></div>
          </Grid>
        </Grid>
      </li>
    );
  }
);

const SortableContainer = sortableContainer(({ children }) => {
  return <ul style={{ listStyle: 'none', padding: '0px' }}>{children}</ul>;
});

class ProgrammeScript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // items: this.props.programmeScript ? this.props.programmeScript.elements : []
      // items: [ 'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6' ]
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const result = arrayMove(this.props.programmeScriptElements, oldIndex, newIndex);
    this.props.handleProgrammeScriptOrderChange(result);
  };

  render() {
    // const { items } = this.state;
    let programme;
    let sortableProgramme;
    if (this.props.programmeScriptElements) {
      programme = this.props.programmeScriptElements.map((el, index) => {
        switch (el.type) {
          case 'title':
            return { el: <TitleHeading key={el.id} title={el.text} />, type: el.type };
          case 'voice-over':
            return { el: <VoiceOver key={el.id} text={el.text} />, type: el.type };
          case 'paper-cut':
            return { el: <PaperCut key={el.id} el={el} speaker={el.speaker} words={el.words} />, type: el.type };
          case 'note':
            return { el: <Note key={el.id} text={el.text} />, type: el.type };
          case 'insert-point':
            return { el: <InsertPoint text={el.text} />, type: el.type };
          default:
            console.error('invalid programme element type');
            return null;
        }
      });
    }

    if (this.props.programmeScriptElements) {
      sortableProgramme = (
        <SortableContainer useDragHandle onSortEnd={this.onSortEnd}>
          {programme.map((value, index) => {
            return (
              <SortableItem
                key={`item-${index}`}
                index={index}
                indexNumber={index}
                value={value.el}
                type={value.type}
                handleDelete={this.props.handleDeleteProgrammeScriptElement}
                handleEdit={this.props.handleEditProgrammeScriptElement}
                handleAddTranscriptElementToProgrammeScript={this.props.handleAddTranscriptElementToProgrammeScript}
                handleAddTranscriptSelectionToProgrammeScriptTmpSave={this.props.handleAddTranscriptSelectionToProgrammeScriptTmpSave}
                handleChangeInsertPointPosition={this.props.handleChangeInsertPointPosition}
              />
            );
          })}
        </SortableContainer>
      );
    }

    return (
      <>
        {/* {programme} */}
        {sortableProgramme}
      </>
    );
  }
}

export default ProgrammeScript;
