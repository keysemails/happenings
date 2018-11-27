import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

import EventInfoForm from '../create/EventInfoForm';

class EditPostPage extends React.Component {
  state = {
    imageLoaded: false,
    eventImage: null,
    successFullyEditedEvent: false
  }
  componentDidMount() {
    const id = this.props.match.params.event_id;
    this.props.getPostData(id);
  }
  imageUploadCallback = (file) => {
    this.setState({
      imageLoaded: true,
      eventImage: file
    });
  }
  componentWillUnmount() {
    if (this.state.eventImage) {
      window.URL.revokeObjectURL(this.state.eventImage);
    }
  }
  addPost = () => {
    const id = this.props.match.params.event_id;
    return this.props.posts[id];
  }
  render() {
    return (
      <div>
        {this.props.loaded && (<EventInfoForm post={this.addPost()}/>)}
      </div>
    )
  }
}

export default EditPostPage;