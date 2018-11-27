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
    const postId = this.props.match.params.event_id;
    // passing in postId so the component can redirect if needed
    return { ...this.props.posts[postId], postId };
  }
  redirectToEventPage = () => {
    return (<Redirect to={`/event/${this.props.match.params.event_id}`} />)
  }
  render() {
    const infoForm = (
      <EventInfoForm
        post={this.addPost()}
      />
    )
    return (
      <div>
        {this.props.loaded && infoForm}
      </div>
    )
  }
}

export default EditPostPage;