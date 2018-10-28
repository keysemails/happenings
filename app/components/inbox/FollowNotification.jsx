import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { updateFollow as _updateFollow } from '../../utils/user';

const FollowNotification = ({
	currentUser,
	followerUid,
	followerName,
	notificationId,
	read,
	removeNotification,
	markAsRead
}) => {
	const classname = classNames('notification', {'unread': !read});
	return (
		<div className={classname} onClick={() => markAsRead(currentUser.uid, notificationId)}>
			<div className='notification-title'>
				<Link to={`/user/${followerName}`}>{followerName}</Link> followed you
			</div>
			<div className='attend-btn cursor-pointer' onClick={removeNotification}>
				x
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
