import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ProfilePosts from './ProfilePosts';
import { selectAuthoredPosts } from '../../reducers/selectors';
import { getTimelinePosts } from '../../actions/profile_actions';

const mapStateToProps = (state, ownProps) => ({
  posts: selectAuthoredPosts(state, ownProps.match.params.username)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getProfilePosts: (feedType) => dispatch(getTimelinePosts(ownProps.uid, feedType))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePosts));
