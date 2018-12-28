import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import EventInfoForm from '../create/EventInfoForm';
import ImageUploader from '../create/ImageUploader';

class EditPostPage extends React.Component {
  state = {
    imageLoaded: false,
    eventImage: null,
    successFullyEditedEvent: false,
    currentImageCleared: false
  }
  componentDidMount() {
    const id = this.props.match.params.event_id;
    this.props.getPostData(id);
  }
  componentWillUnmount() {
    if (this.state.eventImage) {
      window.URL.revokeObjectURL(this.state.eventImage);
    }
  }
  render() {
    const postId = this.props.match.params.event_id;
    if (this.props.loaded) {
      const post = this.props.posts[postId];
      const imageContainer = (
        this.state.currentImageCleared ?
        (
          <ImageUploader
            onDrop={(file) => this.setState({eventImage: file, imageUploaded: true})}
          />
        ) : (
          <div>
            <span onClick={() => this.setState({currentImageCleared: true})}>[x]</span>
            <img src={post.full_url} width="300" />
          </div>
        )
      );
      return (
        <div className='create-container'>
          Edit your poster
          {imageContainer}
          <EventInfoForm
            post={{...post, postId}}
            formData={this.props.formData}
            fillFormData={this.props.fillFormData}
          />
        </div>
      )
    }
    else {
      return (<div>loading...</div>)
    }
  }
}

export default EditPostPage;