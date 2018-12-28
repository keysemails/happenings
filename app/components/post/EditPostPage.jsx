import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import EventInfoForm from '../create/EventInfoForm';
import ImageUploader from '../create/ImageUploader';

/**
 * EditPostPage
 * 
 * Used for both creating new events
 * as well as editing existing events :)
 */
class EditPostPage extends React.Component {
  /** 
   * ensure form fields are cleared when toggling between
   * '/create' and '/event/<event_id>/edit'
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
        this.props.clearFormFields();
    }
  }
  componentDidMount() {
    if (!this.props.isNewEvent) {
      const id = this.props.match.params.event_id;
      this.props.getPostData(id);
    }
  }
  componentWillUnmount() {
    this.props.clearFormFields();
    if (this.props.formData.eventImage != null) {
      window.URL.revokeObjectURL(this.props.formData.eventImage);
      this.props.clearLocalImage();
    }
  }
  handleSubmit = () => {
    if (this.props.isNewEvent) {
      this.props.uploadEvent(this.props.currUser, this.props.history);
    }
  }
  render() {
    const postId = this.props.match.params.event_id;
    if (this.props.loaded) {
      const post = this.props.posts[postId];

      const showUploader = (this.props.eventImageCleared || this.props.isNewEvent);
      const imageContainer = (
        showUploader ?
        (
          <ImageUploader
            clearLocalImage={this.props.clearLocalImage}
            onDrop={(file) => this.props.loadLocalImage(file)}
          />
        ) : (
          <div>
            <span onClick={this.props.clearEventImage}>[x]</span>
            <img src={post.full_url} width="300" />
          </div>
        )
      );
      const btnText = this.props.isNewEvent ? 'Create' : 'Save Changes';
      return (
        <div className='create-container'>
          Edit your poster
          {imageContainer}
          <div className='form'>
            <EventInfoForm
              formData={this.props.formData}
              updateFormField={this.props.updateFormField}
            />
            <div className='submit-btn' onClick={this.handleSubmit}>
              {btnText}
            </div>
          </div>
        </div>
      )
    }
    else {
      return (<div className='loader'></div>)
    }
  }
}

export default EditPostPage;