import React from 'react';
import PropTypes from 'prop-types';

import PostContainer from '../post/PostContainer';

/**
 * Publically viewable page, don't need to be signed in
 */

class ProfilePosts extends React.Component {
	componentDidMount() {
		this.props.getPosts();
	}

	render() {
		const { posts } = this.props;

		return (
			<div>
				{
					Object.keys(posts).map(postId => {
						let postData = posts[postId];
						return (
							<PostContainer
								key={postId}
								id={postId}
								author={postData.author}
								full_storage_uri={postData.full_storage_uri}
								full_url={postData.full_url}
								caption={postData.text}
								thumb_storage_uri={postData.thumb_storage_uri}
								thumb_url={postData.thumb_url}
							/>
						)
					})
				}
			</div>
		);
	}
}

ProfilePosts.propTypes = {
	uid: PropTypes.string,
	isCurrUser: PropTypes.bool
}

export default ProfilePosts;
