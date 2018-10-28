import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toArray } from '../../utils/index';
import { getPostData } from './../../utils/post';

import NotificationContainer from './NotificationContainer.js';

class Inbox extends React.Component {
	componentWillMount() {
		this.props.getNotificationEventData(this.props.notifications);
	}
	addNotifications = () => {
		const { notifications, events } = this.props;
		const notificationList = toArray(this.props.notifications);
		notificationList.sort((a, b) => a.timestamp < b.timestamp);
		return notificationList.map(notification => {
			const ref = notifications[notification.key];
			const event = events[notification.postId];
			return (
				<NotificationContainer
					key={notification.key}
					id={notification.key}
					postId={notification.postId}
				/>
			)
		});
	}
	render() {
		let notification = this.props.unreadNotificationCount == 1 ? 'notification' : 'notifications';
		let count = this.props.unreadNotificationCount > 9 ? '9+' : this.props.unreadNotificationCount;

		return (
			<div>
				<div className='inbox-header'>
					<div className='notification-count'>{count}</div> unread {notification}
				</div>
				{this.props.loaded && this.addNotifications()}
			</div>
		)
	}
}

export default Inbox;