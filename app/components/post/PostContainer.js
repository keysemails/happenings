import { connect } from 'react-redux';
import { updateMainFeed, getMainFeed } from '../../actions/post_actions';
import { listenToPath, removeListener } from '../../actions/listener_actions';
import { openModal, closeModal } from '../../actions/ui_actions';
import { isUserAttendee, isUserLiker } from '../../reducers/selectors';

import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes';
import Post from './Post';

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.session.currentUser,
  comments: state.entities.comments,
  attendees: state.listeners.attendees[ownProps.id] ? state.listeners.attendees[ownProps.id].items : {},
  likers: state.listeners.likers[ownProps.id] ? state.listeners.likers[ownProps.id].items : {},
  currUserAttending: isUserAttendee(state, ownProps.id),
  currUserLiked: isUserLiker(state, ownProps),
  postOptionsModalOpen: !!state.ui.modals.postOptionsModal,
  currUserIsAuthor: (
    !!state.session.currentUser
    && state.session.currentUser.uid === ownProps.author.uid
  )
});
// nextCommentPage: state.callbacks.nextCommentPage[ownProps.id]

const mapDispatchToProps = dispatch => ({
  openPostOptionsModal: (postId) => dispatch(openModal(MODAL_TYPES.POST_OPTIONS_MODAL, postId)),
  closePostOptionsModal: () => dispatch(closeModal(MODAL_TYPES.POST_OPTIONS_MODAL)),
  openAuthorOptionsModal: (postId) => dispatch(openModal(MODAL_TYPES.AUTHOR_OPTIONS_MODAL, postId)),
  registerForLikesCount: (postId) => dispatch(listenToPath(`/likes/${postId}`, 'likers', postId)),
  registerForAttendingCount: (postId) => dispatch(listenToPath(`/attends_post/${postId}`, 'attendees', postId)),
  removeListener: (metaType, postId) => dispatch(removeListener(metaType, postId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
