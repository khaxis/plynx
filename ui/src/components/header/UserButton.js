import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import { SettingsContext } from '../../settingsContext'
import { User } from 'react-feather';

import './style.css';


export default class UserButton extends Component {
  constructor(props) {
    super(props);
    const refreshTokenExists = !!cookie.load('refresh_token');
    const user = cookie.load('user');
    this.state = {
      user: user,
      refreshTokenExists: refreshTokenExists,
    };
  }

  handleLogIn() {
    console.log("Log in");
    window.location = "/login";
  }

  render() {
    return (
      <div className="UserButton">
        {this.state.refreshTokenExists &&
          <SettingsContext.Consumer>{(context) =>{
            return (
                <div className="inner-user-button">
                  <a className="user-menu" href={`/users/${this.state.user.username}`} onClick={(e) => {context.toggleModal(); e.preventDefault()}}>
                    <User/>
                    <div className="username">
                      {this.state.user.username}
                    </div>
                  </a>
                </div>
            )
          }}</SettingsContext.Consumer>
        }
        {!this.state.refreshTokenExists &&
          <div className="inner-user-button">
            <div className="action" onClick={() => this.handleLogIn()}>
              LogIn
            </div>
          </div>
        }
      </div>
    );
  }
}

UserButton.propTypes = {
  onAPIDialogClick: PropTypes.func,
};
