import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	getUserNotifications, getNotificationEventData
} from '../../actions/inbox';
import { countUnreadNotifications } from '../../reducers/selectors';
import Inbox from './Inbox.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
	notifications: state.entities.notifications,
	events: state.entities.posts,
	loadin: state.ui.loading,
	loaded: state.ui.loading.inboxLoading == false && state.ui.loading.userLoading == false && state.ui.loading.notificationsLoading == false,
	unreadNotificationCount: countUnreadNotifications(state)
});

const mapDispatchToProps = dispatch => ({
	getNotificationEventData: (notifications) => dispatch(getNotificationEventData(notifications)),
	getUserNotifications: (uid) => dispatch(getUserNotifications(uid)),
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Inbox));