import React from 'react';
import { withTheme } from '@material-ui/styles';
// https://material-ui.com/styles/api/#withtheme-component-component
// uses material UI themes for the color of the progress bar
const Filler = (props) => {
  const { theme } = props;
  const primaryColor = theme.palette.secondary.main;
  return (
    <div
      style={{
        width: `${props.percentage}%`,
        background: primaryColor,
        height: '100%',
        borderRadius: 'inherit',
      }}
    />
  );
};

export default withTheme(Filler);
