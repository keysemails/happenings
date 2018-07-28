import React from 'react';
import HeaderContainer from './header/HeaderContainer';
import Main from './Main';
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
				this.props.fetchUser(user.email, user.uid).then(() => {
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
				</div>
			)
		}
	}
}

export default App;
