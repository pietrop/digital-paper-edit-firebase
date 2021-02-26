import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

export default function RightDrawer(props) {
  const [rightDraw, setRightDraw] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setRightDraw(open);
  };

  return (
    <div>
      <React.Fragment key={'left'}>
        <Button color="primary" onClick={toggleDrawer(true)}>
          {props.btn}
        </Button>
        <Drawer anchor={'left'} open={rightDraw} onClose={toggleDrawer(false)}>
          {props.children}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
