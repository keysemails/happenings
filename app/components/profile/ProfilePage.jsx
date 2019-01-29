import React from 'react';

import ProfilePostsContainer from './ProfilePostsContainer';
import ProfileHeader from './ProfileHeader';

/**
 * Publically viewable page, don't need to be signed in. Will redirect to
 * public landing if 'like' or 'follow' is clicked with no signed in user.
 */

class ProfilePage extends React.Component {
	constructor() {
		super();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.username != this.props.match.params.username) {
			this.props.removeListener('people');
			this.props.removeListener('followers');
			this.initUserPage(nextProps.match.params.username);
		}
	}

	componentDidMount() {
		this.initUserPage(this.props.match.params.username)
	}

	initUserPage(username) {
		this.props.fetchUserByUsername(username).then(() => {
			this.props.listenToFollowers(this.props.user.uid);
			this.props.listenToFollowing(this.props.user.uid);
		});
	}

	componentWillUnmount() {
		//need to unmount fb listeners on component unmount
		this.props.removeListener('people')
		this.props.removeListener('followers')
	}

	render() {
		const { listenToFollowers,
			listenToFollowing,
			fetchUserByUsername,
			removeListener,
			user,
			...stats } = this.props;
		let isCurrUser = false;

		// will abstact this loading away into HOC or use render props
		if (!user) {
			return <h1>loadin</h1>
		}

		if (this.props.currentUser
			&& this.props.currentUser.uid === user.uid) {
			isCurrUser = true;
		}

		return (
			<div>
				{
					<div>
					{user.username}
						<ProfileHeader
							{...stats}
							user={user}
							isCurrUser={isCurrUser}
						/>
						<ProfilePostsContainer
							uid={user.uid}
							isCurrUser={isCurrUser}
						/>
					</div>
				}
			</div>
		)
	}
}

export default ProfilePage;
