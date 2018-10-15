import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserNotifications, markAsRead } from '../../actions/inbox';
import { countUnreadNotifications } from '../../reducers/selectors';
import Inbox from './Inbox.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
	notifications: state.entities.inbox.notifications,
	loaded: state.ui.loading.notificationsLoading === false,
	unreadNotificationCount: countUnreadNotifications(state)
});

const mapDispatchToProps = dispatch => ({
	getUserNotifications: (uid) => dispatch(getUserNotifications(uid)),
	markAsRead: (uid, notificationId) => dispatch(markAsRead(uid, notificationId)),
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Inbox));