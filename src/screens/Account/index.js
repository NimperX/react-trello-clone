import React, { Component } from 'react';

import AuthUserContext from '../../utils/AuthUserContext';
import withAuthorization from '../../utils/withAuthorization';
import { doPasswordUpdate } from '../../firebase/auth';

import styles from './Account.module.css';
import WrappedAccountForm from './AccountForm';

class AccountScreen extends Component {
  handleSubmit = password => {
    return doPasswordUpdate(password);
  };

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className={styles.account}>
            <h2>Account: {authUser.email}</h2>
            <WrappedAccountForm onSubmit={this.handleSubmit} />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountScreen);
