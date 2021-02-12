import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

function CustomBreadcrumb(props) {
  // const showLinkPath = item => {
  //   return `${item.link}`;
  // };

  const breadcrumbs = props.items.map((item, index) => {
    if (item.link) {
      return (
        // <Link href={`#${showLinkPath(item)}`}>{item.name}</Link>

        <Link color="inherit" key={index} href={`#${item.link}`}>
          {item.name}
        </Link>
      );
    } else {
      return (
        <Typography key={index} color="textPrimary">
          {item.name}
        </Typography>
      );
    }
  });

  return <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>;
}

export default CustomBreadcrumb;
