import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

class Notification extends React.Component {
	formatDate = (datestr) => {
		const DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm';
		let parsed = moment(datestr, DATE_FORMAT_STRING);
		const withinOneWeek = moment().add(7, 'days') > parsed;
		return withinOneWeek ? parsed.calendar() : parsed.format('dddd MMM Do');
	}
	render() {
		const { id, notification, event, markAsRead } = this.props;
		const classname = classNames('notification', {'unread': !notification.read});
		return (
			<div className={classname} onClick={() => markAsRead(id)}>
				<div className='notification-title'>
					{notification.username} {notification.type}
				</div>
				<div className='notification-body'>
					<div>
						<img className='notification-img' src={event.thumb_url}></img>
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