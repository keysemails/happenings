import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateFollow as _updateFollow } from '../../utils/user';

const ProfileStats = ({
	isCurrUser,
	currentUser,
	user,
	numFollowing,
	followers,
	loggedIn,
	history }) => {

	const toggleFollow = () => {
		if (loggedIn) {
			const newVal = !isFollowing;
			_updateFollow(currentUser.uid, user.uid, newVal);
		} else {
			history.push('/');
		}
	}

	const numFollowers = followers.length;
	const numEvents = user.posts ? Object.keys(user.posts).length : 0;
	const isFollowing = currentUser ? followers.includes(currentUser.uid) : false;

	// grammar lol
	const followNoun = numFollowers == 1 ? 'follower' : 'followers';
	const eventsNoun = numEvents == 1 ? 'event' : 'events';
	const followBtnText = isFollowing ? 'U R Following' : 'Follow';

	const settings = (
		<div><Link to='/settings'>settings</Link></div>
	);
	const followBtn = (
		<div onClick={toggleFollow}>{followBtnText}</div>
	);
	const btn = isCurrUser ? settings : followBtn;

	return (
		<div>
			<div>{`${numEvents} ${eventsNoun}`}</div>
			<div>{`${numFollowers} ${followNoun}`}</div>
			<div>{`${numFollowing} following`}</div>
			{btn}
		</div>
	);
}

ProfileStats.propTypes = {
	isCurrUser: PropTypes.bool,
	currentUser: PropTypes.object,
	user: PropTypes.object,
	numFollowing: PropTypes.number,
	followers: PropTypes.array,
	loggedIn: PropTypes.bool
}

export default ProfileStats;
