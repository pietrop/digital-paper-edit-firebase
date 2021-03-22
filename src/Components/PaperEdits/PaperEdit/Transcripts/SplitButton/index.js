import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
// import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHighlighter } from '@fortawesome/free-solid-svg-icons';
import CustomDrawer from '../../../../lib/CustomDrawer';

export default function SplitButton({ options, handleCreateAnnotation, children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup aria-label="split button" fullWidth={true} variant="text" color="primary">
        <Button
          data-label-id={options[0].id}
          onClick={() => {
            handleCreateAnnotation(options[0].id);
          }}
        >
          <FontAwesomeIcon icon={faHighlighter} flip="horizontal" /> Highlight
        </Button>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickMenu}>
          <ArrowDropDownIcon />
        </Button>
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {options.map((option, index) => {
            return (
              <MenuItem
                onClick={() => {
                  handleCreateAnnotation(option.id);
                  handleCloseMenu();
                }}
              >
                <Grid container direction="row" justify="space-between" alignItems="stretch" spacing={2}>
                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    lg={2}
                    xl={2}
                    style={{ backgroundColor: option.color, color: 'transparent' }}
                    data-label-id={option.id}
                  >
                    ______
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10} data-label-id={option.id}>
                    {option.label}
                  </Grid>
                </Grid>
              </MenuItem>
            );
          })}
        </Menu>
        <CustomDrawer btn={<SettingsOutlinedIcon />}>{children}</CustomDrawer>
      </ButtonGroup>
    </>
  );
}
