import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toArray } from '../../utils/index';

import Notification from './Notification';

class Inbox extends React.Component {
	getNotifications() {
		this.props.getUserNotifications(this.props.currentUser.uid);
	}
	componentDidMount() {
		this.getNotifications();
	}
	markAsRead = (id) => {
		this.props.markAsRead(this.props.currentUser.uid, id);
	}
	addNotifications() {
		const notifications = toArray(this.props.notifications);
		return notifications.map(notification => {
			return (
				<Notification
					key={notification.key}
					id={notification.key}
					notification={notification}
					markAsRead={this.markAsRead}
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