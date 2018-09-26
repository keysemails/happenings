import { connect } from 'react-redux';
import { updateMainFeed, getMainFeed } from '../../actions/post_actions';
import { listenToPath, removeListener } from '../../actions/listener_actions';
import { openModal } from '../../actions/ui_actions';
import { isUserAttendee, isUserLiker } from '../../reducers/selectors';

import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes';
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
  openPostOptionsModal: (postId) => dispatch(openModal(MODAL_TYPES.POST_OPTIONS_MODAL, postId)),
  registerForLikesCount: (postId) => dispatch(listenToPath(`/likes/${postId}`, 'likers', postId)),
  registerForAttendingCount: (postId) => dispatch(listenToPath(`/attends_post/${postId}`, 'attendees', postId)),
  removeListener: (metaType, postId) => dispatch(removeListener(metaType, postId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
