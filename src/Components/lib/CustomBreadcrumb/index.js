import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import CustomLink from '../CustomLink';

function CustomBreadcrumb(props) {
  const breadcrumbs = props.items.map((item, index) => {
    if (item.link) {
      return (
        <CustomLink to={item.link} key={index}>
          {item.name}
        </CustomLink>
      );
    } else {
      return (
        <div key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography key={index} color="textPrimary" noWrap>
            {item.name}
          </Typography>
        </div>
      );
    }
  });

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>;
}

export default CustomBreadcrumb;
