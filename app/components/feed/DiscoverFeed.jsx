import React from 'react';
import PropTypes from 'prop-types';
import PostFeed from './PostFeed';
import PostContainer from '../post/PostContainer.js';

const INTERACTION_VERBS = {
	like: 'liked',
	comment: 'commented on',
	'attend': 'is attending'
};

class DiscoverFeed extends React.Component {
	constructor() {
		super();
		this.URI = '/posts/';
		this.PAGE_SIZE = 5;
		this.state = {
			posts: {},
			nextPage: null,
			gotPostData: false,
		}
	}
	componentDidMount() {
		this.props.getDiscoverFeed(this.props.currentUser.uid);
	}
	addPosts() {
		const { friendActivity } = this.props;
		return Object.keys(friendActivity).map(postId => {
			let postData = friendActivity[postId].postInfo;
			// hotfix to address race condition that arises from the fact that
			// all feed types currently share the same slice of state
			if (friendActivity[postId].hasOwnProperty('friendInfo')) {
				let friendInfo = friendActivity[postId].friendInfo;
				const verb = INTERACTION_VERBS[friendInfo.interaction_type];
				const msg = `${friendInfo.username} ${verb} ${postData.author.username}'s event`;
				return (
					<div>
						<div>{msg}</div>
						<PostContainer
							key={postId}
							id={postId}
							author={postData.author}
							full_storage_uri={postData.full_storage_uri}
							full_url={postData.full_url}
							caption={postData.text}
							thumb_storage_uri={postData.thumb_storage_uri}
							thumb_url={postData.thumb_url}
							event_timestamp={postData.event_timestamp}
							title={postData.title}
							location={postData.location}
							description={postData.description}
						/>
					</div>
				)
			}
		})
	}
	render() {
		const { friendActivity, loading, nextPage } = this.props;
		const noPosts =Object.keys(friendActivity).length === 0;
		const noDiscoverMsg = 'nobody you follow has done anything! follow cooler people!'
		if (loading) {
			return <h1>LOADING</h1>
		}
		return (
			<div>
				{ noPosts ? noDiscoverMsg : this.addPosts() }
			</div>
		);
	}
}

DiscoverFeed.propTypes = {
	getDiscoverFeed: PropTypes.func,
}

export default DiscoverFeed;
