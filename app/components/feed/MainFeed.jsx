import React from 'react';
import PropTypes from 'prop-types';
import PostFeed from './PostFeed';

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
		const noPosts = Object.keys(posts).length === 0;
		const noPostMsg = 'no events here yet! go follow some people!';

		if (loading) {
			return <h1>LOADING</h1>
		}
		return (
				<div>
					{ noPosts ? noPostMsg : (
						<PostFeed
							posts={posts}
							nextPage={nextPage}
						/>
					)}
				</div>
		)
	}
}

MainFeed.propTypes = {
	posts: PropTypes.object,
	loading: PropTypes.bool,
	nextPage: PropTypes.func,
}

export default MainFeed;
