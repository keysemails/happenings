import { connect } from 'react-redux';
import { listenToPath, removeListener } from '../../actions/listener_actions';
import { markAsRead, removeNotification } from '../../actions/inbox';
import { isUserAttendee } from '../../reducers/selectors';
import Notification from './Notification';

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.session.currentUser,
  notification: state.entities.notifications[ownProps.id],
  read: state.entities.notifications[ownProps.id].read,
  event: ownProps.postId ? state.entities.posts[ownProps.postId] : null,
  currUserAttending: ownProps.postId ? isUserAttendee(state, ownProps.postId) : null,

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
