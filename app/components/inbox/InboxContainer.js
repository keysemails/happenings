import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserNotifications } from '../../actions/inbox';
import Inbox from './Inbox.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
	notifications: state.entities.inbox,
	loaded: state.ui.loading.notificationsLoading === false
});

const mapDispatchToProps = dispatch => ({
	getUserNotifications: (uid) => dispatch(getUserNotifications(uid))
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Inbox));