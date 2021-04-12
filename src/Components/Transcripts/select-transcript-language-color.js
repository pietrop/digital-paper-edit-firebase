// helper function for adding custom stylings to speakers in react-select component in search bar
// https://react-select.com/styles

const tmpBackgroundColor = 'white';
const tmpColor = 'black';

const selectTranscriptLanguageColor = {
  control: (styles) => ({
    ...styles,
    backgroundColor: tmpBackgroundColor,
  }),
  option: (styles) => {
    return {
      ...styles,
      color: tmpColor,
      backgroundColor: tmpBackgroundColor,
      cursor: 'default',
    };
  },

  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: tmpBackgroundColor,
      border: '0.05em solid grey',
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
  }),
  multiValueRemove: (styles) => ({
    ...styles,
  }),
};

export default selectTranscriptLanguageColor;
