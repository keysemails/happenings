import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {getPostData } from '../../actions/post_actions';

import PostPage from './PostPage';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	loaded: state.ui.loading.postsLoading === false
});

const mapDispatchToProps = dispatch => ({
	getPostData: (postID) => dispatch(getPostData(postID))
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(PostPage));
