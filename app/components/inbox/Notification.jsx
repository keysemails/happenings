import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as NotificationTypes from '../../constants/notificationTypes';

class Notification extends React.Component {
	formatDate = (datestr) => {
		const DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm';
		let parsed = moment(datestr, DATE_FORMAT_STRING);
		const withinOneWeek = moment().add(7, 'days') > parsed;
		return withinOneWeek ? parsed.calendar() : parsed.format('dddd MMM Do');
	}
	conjugateNotification = (notification, event) => {
		const userLink = (
			<Link to={`/user/${notification.username}`}>{notification.username}</Link>
		);
		switch(notification.type) {
			case (NotificationTypes.INVITE_TO_EVENT):
				return (<span>{userLink} invited you to:</span>)
			case (NotificationTypes.SHARE_EVENT):
				const authorLink = (
					<Link to={`/user/${event.author.username}`}>{event.author.username}</Link>
				);
				return (<span>{userLink} shared {authorLink}'s event:</span>
				)
			case (NotificationTypes.EVENT_TIME_CHANGE):
				return (
					<span>Time Change:</span>
				)
			case (NotificationTypes.EVENT_CANCELLED):
				return (
					<span>CANCELLED:</span>
				)
			case (NotificationTypes.USER_ATTENDING):
				return (
					<span>{userLink} is attending:</span>
				)
			case (NotificationTypes.USER_COMMENTED):
				return (
					<span>{userLink} commented:</span>
				)
		}
	}
	render() {
		const { id, notification, event, markAsRead } = this.props;
		const classname = classNames('notification', {'unread': !notification.read});
		return (
			<div className={classname} onClick={() => notification.read ? null : markAsRead(id)}>
				<div className='notification-title'>
					{this.conjugateNotification(notification, event)}
				</div>
				<div className='notification-body'>
					<div>
						<Link to={`/event/${notification.postId}`}>
							<img className='notification-img' src={event.thumb_url}></img>
						</Link>
					</div>
					<div className='event-details'>
						{event.title}<br/>
						{event.description}<br/>
						&#176;{event.location}<br/>
						{this.formatDate(event.date_string)}
					</div>
				</div>
			</div>
		)
	}
}

export default Notification;