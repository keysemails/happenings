import React from 'react';
import PostFeed from './PostFeed';
import { getPosts } from '../../utils/feed';
import { updateDiscoverFeed } from '../../utils/discover';
import { getAuth } from '../../utils/auth';

// TODO: Rename this to TimelineFeed or something
class DiscoverFeed extends React.Component {
	constructor() {
		super();
		this.auth = getAuth();
		this.URI = '/posts/';
		this.PAGE_SIZE = 5;
		this.state = {
			posts: {},
			nextPage: null,
			gotPostData: false,
		}
	}
	componentDidMount() {
		getPosts(this.URI, this.PAGE_SIZE).then(data => {
			this.setState({
				posts: data.entries,
				gotPostData: true,
				nextPage: data.nextPage,
			});
		});
	}
	render() {
		const postFeed = (
			<PostFeed
				posts={this.state.posts}
				nextPage={this.state.nextPage}
			/>
		);
		return (
			<div>
				{this.state.gotPostData && postFeed}
			</div>
		);
	}
}

export default DiscoverFeed;
