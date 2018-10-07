import React from 'react';
import classNames from 'classnames';

const Notification = ({id, notification, markAsRead}) => {
	const classname = classNames('notification', {'unread': !notification.read});
	return (
		<div className={classname} onClick={() => markAsRead(id)}>
			{notification.username} {notification.type} {notification.postId}
		</div>
	)
}

export default Notification;