import React, { Component } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

class CustomBreadcrumb extends Component {
  render() {
    const breadcrumbs = this.props.items.map((item, index) => {
      if (item.link) {
        return (
          <Breadcrumb.Item key={index} href={`#${item.link}`}>
            {' '}
            {item.name}
          </Breadcrumb.Item>
        );
      } else {
        return (
          <Breadcrumb.Item key={index} active>
            {item.name}
          </Breadcrumb.Item>
        );
      }
    });

    return (
      <>
        <style scoped>
          {`
        .breadcrumb{ 
          background-color: ${this.props.backgroundColor};
          ${this.props.backgroundColor ? ' margin: 0px' : ''} 
          }
        `}
        </style>
        <div
        // className="d-none d-sm-block"
        >
          <Breadcrumb>{breadcrumbs}</Breadcrumb>
        </div>
      </>
    );
  }
}

export default CustomBreadcrumb;
