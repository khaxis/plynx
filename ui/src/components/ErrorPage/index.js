import React, { Component } from 'react';
import { AlertOctagon } from 'react-feather';

import './style.css';

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    if (this.props.errorCode === 404) {
      document.title = "Not Found - PLynx";
      this.errorText = "404: not found";
    }
  }

  render() {
    return (
        <div className='login-redirect'>
          <div className="login-redirect-logo">
              <AlertOctagon className="error-icon" />
              <div className="error-text">
                {this.errorText}
              </div>
          </div>
        </div>
    );
  }
}