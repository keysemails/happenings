import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getMainFeed } from '../../actions/post_actions';
import MainFeed from './MainFeed';

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
)(MainFeed));
