import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateMainFeed, getMainFeed } from '../../actions/post_actions';
import DiscoverFeed from './DiscoverFeed.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
	posts: state.entries.posts,
	loading: state.ui.postsLoading,
	nextPage: state.callbacks.nextFeedPage
});

const mapDispatchToProps = dispatch => ({
	getDiscoverFeedPosts: 
})

