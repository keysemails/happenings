import { connect } from 'react-redux';
import { listenToPath, removeListener } from '../../actions/listener_actions';
import { markAsRead, removeNotification } from '../../actions/inbox';
import { isUserAttendee } from '../../reducers/selectors';

import Notification from './Notification';

const mapStateToProps = (state, ownProps) => ({
	currentUser: state.session.currentUser,
	event: state.entities.posts[ownProps.postId],
	notification: state.entities.inbox.notifications[ownProps.id],
	read: state.entities.inbox.notifications[ownProps.id].read,
	currUserAttending: isUserAttendee(state, ownProps.postId),

});

const mapDispatchToProps = (dispatch) => ({
	markAsRead: (uid, notificationId) => dispatch(markAsRead(uid, notificationId)),
	registerForAttendingCount: (postId) => dispatch(listenToPath(`/attends_post/${postId}`, 'attendees', postId)),
	removeListener: (metaType, postId) => dispatch(removeListener(metaType, postId)),
	removeNotification: (uid, notificationId) => dispatch(removeNotification(uid, notificationId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Notification);