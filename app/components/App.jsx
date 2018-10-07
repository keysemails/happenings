import React from 'react';
import HeaderContainer from './header/HeaderContainer';
import Main from './Main';
import ModalContainer from './modals/ModalContainer';
import { getAuth } from '../utils/auth';

class App extends React.Component {
	constructor() {
		super();
		this.state = { loading: true }
	}

	componentDidMount() {
		// fetching authenticated user to store in redux. must unsubscribe
		// don't want authstate changed listener firing when we log in and
		// out normally
		const unsubscribe = getAuth().onAuthStateChanged((user) => {
		  if (user) {
		  		let tasks = [
		  			this.props.fetchUser(user.email, user.uid),
		  			this.props.getUserNotifications(user.uid)
	  			];
				Promise.all(tasks).then(() => {
					console.log('done');
					this.setState({loading: false});
				});
				unsubscribe();
			} else {
				unsubscribe();
				this.setState({loading: false});
			}
		});
  }

	render() {
		if (this.state.loading) {
			return <div className='loader' />
		} else {
			return (
				<div>
					<HeaderContainer />
					<Main loggedIn={this.props.loggedIn} />
					<ModalContainer />

				</div>
			)
		}
	}
}

export default App;
