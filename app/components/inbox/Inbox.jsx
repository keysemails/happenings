import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toArray } from '../../utils/index';
import { getPostData } from './../../utils/post';

import Notification from './Notification';

class Inbox extends React.Component {
	componentWillMount() {
		this.props.getNotificationEventData(this.props.notifications);
	}
	markAsRead = (notificationId) => {
		this.props.markAsRead(this.props.currentUser.uid, notificationId);
	}
	addNotifications = () => {
		const { notifications, events } = this.props;
		const notificationList = toArray(this.props.notifications);
		return notificationList.map(notification => {
			const ref = notifications[notification.key];
			const event = events[notification.postId];
			return (
				<Notification
					key={notification.key}
					id={notification.key}
					notification={ref}
					event={event}
					markAsRead={this.markAsRead}
				/>
			)
		});
	}
	render() {
		return (
			<div>
				<div>{this.props.unreadNotificationCount} unread notifications</div>
				{this.props.loaded && this.addNotifications()}
			</div>
		)
	}
}

export default Inbox;