import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateMainFeed, getMainFeed } from '../../actions/post_actions';
import DiscoverFeed from './DiscoverFeed';

const mapStateToProps = state => ({
  loggedIn: !!state.session.currentUser,
  currentUser: state.session.currentUser,
  posts: state.entities.posts,
  loading: state.ui.postsLoading,
  nextPage: state.callbacks.nextFeedPage
});

const mapDispatchToProps = dispatch => ({
  getMainFeed: (uid) => dispatch(getMainFeed(uid))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverFeed));
