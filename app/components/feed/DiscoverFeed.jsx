import React from 'react';
import PostFeed from './PostFeed';
import { updateDiscoverFeeds, getDiscoverFeedPosts } from '../../utils/feed';

// the Router will guarantee that this component only mounts if the user is signed in.
class DiscoverFeed extends React.Component {
	constructor() {
		super();
		this.state = {
			posts: {},
			nextPage: null,
			gotPostData: false,
			_isMounted: false
		}
	}
	componentWillMount() {
		this.setState({ _isMounted: true });
		console.log(this.props.currentUser)
		this.initDiscoverFeed();
	}
	componentWillUnmount() {
		this.setState({ _isMounted: false });
	}
	initDiscoverFeed = () => {
		const currentUser = this.props.currentUser;
		// TODO: better is_logged_in or is_not_logged in logic
		// bewarned !!{} == true
		if (currentUser.hasOwnProperty('uid')) {
			updateDiscoverFeeds(currentUser.uid).then(() => {
				getDiscoverFeedPosts(currentUser.uid).then(data => {
					const postIds = Object.keys(data.entries);
					if (postIds.length === 0) {
						console.log('no posts! follow sum ppl');
					}
					// TODO: isten for new posts
					// const latestPostId = postIds[postIds.length - 1];
					// subscribeToDiscoverFeed(
					// 	(postId, postValue) => {
					// 		addNewPost(postId, postValue);
					// 	}, latestPostid
					// );
					if (this.state._isMounted) {
						this.setState({
							posts: data.entries,
							nextPage: data.nextPage,
							gotPostData: true
						});
					}
				});
			});
		}
	}
	render() {
		const noPostMsg = 'no posts yet! go follow some people!';
		const ret = Object.keys(this.state.posts).length === 0 ? (
			<div>{noPostMsg}</div>
		) : (
			<PostFeed
				posts={this.state.posts}
				nextPage={this.state.nextPage}
				currentUsername={this.props.currentUser.username}
			/>
		);
		return (
				<div>
					{this.state.gotPostData && ret }
				</div>
		)
	}
}

export default DiscoverFeed;
