import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Notification from './Notification';

class Inbox extends React.Component {
	getNotifications() {
		this.props.getUserNotifications(this.props.currentUser.uid);
	}
	componentDidMount() {
		this.getNotifications();
	}
	addNotifications() {
		return Object.keys(this.props.notifications).map(idx => {
			const notification = this.props.notifications[idx];
			return (
				<Notification
					key={idx}
					postId={notification.postId}
					username={notification.username}
					uid={notification.uid}
					notificationType={notification.type}
					read={notification.read}
				/>
			)
		});
	}
	render() {
		return (
			<div>
				{this.props.loaded && this.addNotifications()}
			</div>
		)
	}
}

export default Inbox;