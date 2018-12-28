import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getPostData, uploadEventData } from '../../actions/post_actions';
import { fillFormData, updateFormField, clearFormFields, clearEventImage,
  loadLocalImage, clearLocalImage, validateFormFields } from '../../actions/form_actions';

import EditPostPage from './EditPostPage';


const mapStateToProps = (state, ownProps) => ({
    loggedIn: !!state.session.currentUser,
    currUser: state.session.currentUser,
    posts: state.entities.posts,
    formData: state.ui.form.fields,
    // bypass if we don't need to load existing post data
    loaded: (
      state.ui.loading.postsLoading === false || ownProps.isNewEvent
    ) && state.ui.loading.eventUploading === false,
    eventImageCleared: state.ui.form.eventImageCleared,
    isNewEvent: ownProps.isNewEvent || false
});

const mapDispatchToProps = dispatch => ({
    clearLocalImage: () => dispatch(clearLocalImage()),
    clearEventImage: () => dispatch(clearEventImage()),
    clearFormFields: () => dispatch(clearFormFields()),
    validateFormFields: () => dispatch(validateFormFields()),
    getPostData: (postID) => dispatch(getPostData(postID)),
    fillFormData: (postID) => dispatch(fillFormData(postID)),
    updateFormField: (fieldName, value) => dispatch(updateFormField(fieldName, value)),
    loadLocalImage: (imageFille) => dispatch(loadLocalImage(imageFille)),

    // passing history object so redux action can redirect to new event page
    uploadEvent: (currUser, history) => dispatch(uploadEventData(currUser, history))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EditPostPage));
