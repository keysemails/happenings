import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateFollow as _updateFollow } from '../../utils/user';

const FollowNotification = ({
	currentUser,
	followerUid,
	followerName,
	read,
	notificationId
}) => {
	const classname = classNames('notification', {'unread': !read});
	return (
		<div className={classname} onClick={() => markAsRead(notificationId)}>
			<div className='notification-title'>
				<Link to={`/user/${followerUid}`}>{followerName}</Link> followed you
			</div>
		</div>
	)
}

FollowNotification.propTypes = {
	currentUser: PropTypes.object,
	followerUid: PropTypes.string,
	followerName: PropTypes.string,
	read: PropTypes.bool,
	notificationId: PropTypes.string
}

export default FollowNotification;