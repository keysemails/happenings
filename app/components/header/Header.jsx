import React from 'react';
import { Switch, Route } from 'react-router-dom';
import InboxHeader from './InboxHeader';
import DefaultHeader from './DefaultHeader';

const Header = (props) => {
  return (
    <Switch>
      <Route path='/inbox' component={InboxHeader} />
      <Route path='/' render={() => (<DefaultHeader {...props} />)} />
    </Switch>
  )
}

export default Header;
