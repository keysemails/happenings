import React from 'react';
import HeaderContainer from './header/HeaderContainer';
import Main from './Main';
import ModalContainer from './modals/ModalContainer';
import { getAuth } from '../utils/auth';

class App extends React.Component {
  componentDidMount() {
    // fetching authenticated user to store in redux. must unsubscribe
    // don't want authstate changed listener firing when we log in and
    // out normally
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.fetchUser(user.email, user.uid);
        this.props.getUserNotifications(user.uid);
      } else {
        this.props.proceedWithoutLogin()
      }
      unsubscribe();
    });
  }

  render() {
    if (this.props.loaded) {
      return (
        <div>
          <HeaderContainer />
          <Main loggedIn={this.props.loggedIn} loaded={this.props.loaded}/>
          <ModalContainer />
        </div>
      )
    } else {
      return (<div className='loader' />)
    }
	}
}

export default App;
