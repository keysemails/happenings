import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { toArray } from '../../utils/index';
import { getPostData } from './../../utils/post';

import Notification from './Notification';

class Inbox extends React.Component {
	state = {
		loaded: false,
		notificationList: []
	}
	componentDidMount() {
		this.getEventData()
	}
	markAsRead = (notificationId) => {
		this.props.markAsRead(this.props.currentUser.uid, notificationId);
	}
	getNotificationEventData(notification) {
		return getPostData(notification.postId).then(data => {
			return {
				...notification,
				event: data.val()
			}
		});
	}
	getEventData() {
		const notifications = toArray(this.props.notifications);
		const queries = notifications.map(notification => {
			return this.getNotificationEventData(notification)
		});
		return Promise.all(queries).then(results => {
			this.setState({
				'loaded': true,
				'notificationList': results
			});
		})
	}
	addNotifications() {
		return this.state.notificationList.map(notification => {
			const ref = this.props.notifications[notification.key];
			return (
				<Notification
					key={notification.key}
					id={notification.key}
					notification={ref}
					event={notification.event}
					markAsRead={this.markAsRead}
				/>
			)
		});
	}
	render() {
		return (
			<div>
				<div>{this.props.unreadNotificationCount} unread notifications</div>
				{this.state.loaded && this.addNotifications()}
			</div>
		)
	}
}

export default Inbox;