import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getPostData } from '../../actions/post_actions';
import { fillFormData } from '../../actions/form_actions';

import EditPostPage from './EditPostPage';


const mapStateToProps = (state, ownProps) => ({
    loggedIn: !!state.session.currentUser,
    currUser: state.session.currentUser,
    posts: state.entities.posts,
    formData: state.ui.form,
    loaded: state.ui.loading.postsLoading === false,
});

const mapDispatchToProps = dispatch => ({
    getPostData: (postID) => dispatch(getPostData(postID)),
    fillFormData: (post) => dispatch(fillFormData(post))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EditPostPage));