import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function CustomDrawer(props) {
  const orientation = props.orientation ? props.orientation : 'left';
  const [rightDraw, setRightDraw] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setRightDraw(open);
  };

  return (
    <div>
      <React.Fragment key={orientation}>
        <Button color="primary" onClick={toggleDrawer(true)}>
          {props.btn}
        </Button>
        <Drawer style={{ width: '50%' }} anchor={orientation} open={rightDraw} onClose={toggleDrawer(false)}>
          <Grid container>{props.children}</Grid>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
