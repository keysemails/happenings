import React from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../utils/feed'
import Post from '../post/Post.jsx';

// TODO: put a 'load more posts' button at the bottom
// this button should utilize the pagination callback that is returned by getPaginatedFeed

class PostFeed extends React.Component {
	addPosts() {
		return Object.keys(this.props.posts).map(postId => {
			let postData = posts[postId];
			return (
				<Post
					key={postId}
					id={postId}
					author={postData.author}
					full_storage_uri={postData.full_storage_uri}
					full_url={postData.full_url}
					caption={postData.text}
					thumb_storage_uri={postData.thumb_storage_uri}
					thumb_url={postData.thumb_url}
					currentUsername={this.props.currentUsername}
					event_timestamp={postData.event_timestamp}
					title={postData.title}
					location={postData.location}
					description={postData.description}
				/>
			)
		});
	}
	render() {
		return (
			<div>{ this.addPosts() }</div>
		);
	}
}

PostFeed.propTypes = {
	posts: PropTypes.object,
	nextPage: PropTypes.func,
	currentUsername: PropTypes.string,
}

export default PostFeed;
