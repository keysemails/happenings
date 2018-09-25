import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getDiscoverFeed } from '../../actions/post_actions';
import DiscoverFeed from './DiscoverFeed.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
	// friendActivity keys are postIds but the value contains postInfo and friendInfo
	friendActivity: state.entities.posts,
	loading: state.ui.loading.postsLoading,
	nextPage: state.callbacks.nextFeedPage,
});

const mapDispatchToProps = dispatch => ({
	getDiscoverFeed: (uid) => dispatch(getDiscoverFeed(uid))
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(DiscoverFeed));
