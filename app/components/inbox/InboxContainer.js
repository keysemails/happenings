import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getUserNotifications, getNotificationEventData
} from '../../actions/inbox_actions';
import { countUnreadNotifications } from '../../reducers/selectors';
import Inbox from './Inbox.jsx';

const mapStateToProps = state => ({
  loggedIn: !!state.session.currentUser,
  currentUser: state.session.currentUser,
  notifications: state.entities.notifications,
  events: state.entities.posts,
  loaded: (
    state.ui.loading.notificationsLoaded &&
    state.ui.loading.userLoaded &&
    state.ui.loading.inboxLoaded
  ),
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