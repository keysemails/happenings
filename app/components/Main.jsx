import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getAuth } from '../utils/auth';

import DiscoverFeedContainer from './feed/DiscoverFeedContainer.js';
import MainFeedContainer from './feed/MainFeedContainer';

import PublicLanding from './PublicLanding.jsx';
import SignUpForm from './SignUpForm.jsx';
import LoginFormContainer from './LoginFormContainer.js';

import ProfilePageContainer from './profile/ProfilePageContainer.jsx';
import PostPage from './post/PostPage.jsx';
import AccountSettings from './account_settings/AccountSettings.jsx';

import CreateEvent from './create/CreateEvent.jsx';

class Main extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<main>
				<Switch>
					<Route exact path='/' render={() => (
						this.props.loggedIn ? (<MainFeedContainer />) : (<PublicLanding />)
					)} />
					<Route path='/discover' render={() => (
						this.props.loggedIn ? (<DiscoverFeedContainer />) : (<PublicLanding />)
					)} />
					<Route path='/signup' component={SignUpForm} />
					<Route path='/login' component={LoginFormContainer} />
					<Route path='/user/:username' component={ProfilePageContainer} />
					<Route path='/event/:event_id' component={PostPage} />
					<Route path='/settings' component={AccountSettings} />
					<Route path='/create' component={CreateEvent} />
				</Switch>
			</main>
		);
	}
}

export default Main;
