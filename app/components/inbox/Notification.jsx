import React from 'react';

const Notification = ({postId, username, uid, read, notificationType}) => {
	return (
		<div>
			{username} {notificationType} {postId}
		</div>
	)
}

export default Notification;