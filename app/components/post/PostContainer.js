import { connect } from 'react-redux';
import { updateMainFeed, getMainFeed } from '../../actions/post_actions';
import { listenToPath, removeListener } from '../../actions/listener_actions';
import { isUserAttendee, isUserLiker } from '../../reducers/selectors';
import Post from './Post';

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.session.currentUser,
  comments: state.entities.comments,
  attendees: state.listeners.attendees[ownProps.id] ? state.listeners.attendees[ownProps.id].items : {},
  likers: state.listeners.likers[ownProps.id] ? state.listeners.likers[ownProps.id].items : {},
  currUserAttending: isUserAttendee(state, ownProps),
  currUserLiked: isUserLiker(state, ownProps)
});
// nextCommentPage: state.callbacks.nextCommentPage[ownProps.id]

const mapDispatchToProps = dispatch => ({
  registerForLikesCount: (postId) => dispatch(listenToPath(`/likes/${postId}`, 'likers', postId)),
  registerForAttendingCount: (postId) => dispatch(listenToPath(`/attends_post/${postId}`, 'attendees', postId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
