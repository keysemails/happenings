import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as NotificationTypes from '../../constants/notificationTypes';
import { updateAttending } from '../../utils/post';
import FollowNotification from './FollowNotification';

class Notification extends React.Component {
	componentWillMount() {
		this.props.registerForAttendingCount(this.props.postId);
	}
	componentWillUnmount() {
		this.props.removeListener('attendees', this.props.postId);
	}
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
					<span>{userLink} will attend your event:</span>
				)
			case (NotificationTypes.USER_COMMENTED):
				return (
					<span>{userLink} commented:</span>
				)
		}
	}
	markAsRead = () => {
		const { read, markAsRead, currentUser, id } = this.props;
		return  read ? null : markAsRead(currentUser.uid, id);
	}
	updateAttend = () => {
		const { currentUser, event, currUserAttending, postId } = this.props;
		// only allow to attend if not yet attending
		if (!currUserAttending) {
			return updateAttending(
				currentUser, postId, event.author.uid, event.event_timestamp, !!!currUserAttending
			);
		}
	}
	removeNotification = e => {
		// don't let the outer markAsRead fire if trying to delete
		e.stopPropagation();
		const { currentUser, id } = this.props;
		return this.props.removeNotification(currentUser.uid, id);
	}
	render() {
		const {
			currentUser, read, postId, event, notification, id,
			currUserAttending, removeNotification, markAsRead
		} = this.props;
		if (notification.type == NotificationTypes.FOLLOWED_BY_USER) {
			return (
				<FollowNotification
					notificationId={id}
					currentUser={currentUser}
					followerUid={notification.uid}
					followerName={notification.username}
					read={read}
					removeNotification={this.removeNotification}
					markAsRead={markAsRead}
				/>
			)
		}
		const classname = classNames('notification', {'unread': !read});
		const attendBtn = classNames('attend-btn', {'cursor-pointer': !currUserAttending});
		return (
			<div className={classname} onClick={() => this.markAsRead(id)} >
				<div className='notification-title'>
					{this.conjugateNotification(notification, event)}
				</div>
				<div className='notification-body'>
					<div>
						<Link to={`/event/${postId}`}>
							<img className='notification-img' src={event.thumb_url}></img>
						</Link>
					</div>
					<div className='event-details'>
						{event.title}<br/>
						{event.description}<br/>
						&#176;{event.location}<br/>
						{this.formatDate(event.date_string)}<br/>
						<br/>
						<div className='notification-btn-container'>
							<div className={attendBtn} onClick={this.updateAttend}>
								{ currUserAttending ? 'attending!' : 'attend' }
							</div>
							<div className='attend-btn cursor-pointer' onClick={this.removeNotification}>
								X
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Notification;