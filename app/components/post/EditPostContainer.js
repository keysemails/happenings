import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getPostData } from '../../actions/post_actions';

import EditPostPage from './EditPostPage';


const mapStateToProps = (state, ownProps) => ({
    loggedIn: !!state.session.currentUser,
    currUser: state.session.currentUser,
    posts: state.entities.posts,
    loaded: state.ui.loading.postsLoading === false
});

const mapDispatchToProps = dispatch => ({
    getPostData: (postID) => dispatch(getPostData(postID))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EditPostPage));