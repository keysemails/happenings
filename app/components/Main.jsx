import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getAuth } from '../utils/auth';

import DiscoverFeedContainer from './feed/DiscoverFeedContainer';
import MainFeedContainer from './feed/MainFeedContainer';

import PublicLanding from './PublicLanding';
import SignUpForm from './SignUpForm';
import LoginFormContainer from './LoginFormContainer';

import ProfilePageContainer from './profile/ProfilePageContainer';
import PostPageContainer from './post/PostPageContainer';
import AccountSettings from './account_settings/AccountSettings';

import InboxContainer from './inbox/InboxContainer';
import EditPostContainer from './post/EditPostContainer';

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
					<Route path='/event/:event_id/edit' component={EditPostContainer} />
					<Route path='/event/:event_id' component={PostPageContainer} />
					<Route path='/settings' component={AccountSettings} />
					<Route path='/create' render={(props) => (
            <EditPostContainer {...props} isNewEvent={true} />
          )} />
					{ this.props.loaded && <Route path='/inbox' component={InboxContainer} /> }
				</Switch>
			</main>
		);
	}
}

export default Main;
