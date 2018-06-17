import React from 'react';
import PostFeed from './PostFeed';
import { getDiscoverFeedPosts } from '../../utils/feed';

// the Router will guarantee that this component only mounts if the user is signed in.
class MainFeed extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		this.props.getMainFeed(this.props.currentUser.uid)
	}
	render() {
		const { posts, loading, nextPage } = this.props;
		const noPostMsg = 'no posts yet! go follow some people!';

		if (loading) {
			return <h1>LOADING</h1>
		}
		const ret = Object.keys(posts).length === 0 ? (
			<div>{noPostMsg}</div>
		) : (
			<PostFeed
				posts={posts}
				nextPage={nextPage}
			/>
		);
		return (
				<div>
					{ ret }
				</div>
		)
	}
}

export default MainFeed;
