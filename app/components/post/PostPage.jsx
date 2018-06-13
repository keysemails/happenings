import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { getPostData } from '../utils/post';
import Post from './post/Post.jsx';

/**
 * Publically viewable Event page, don't need to be signed in. Will redirect to
 * public landing if 'like' or 'attend' is clicked with no signed in user.
 */

class PostPage extends React.Component {
	constructor() {
		super();
		this.state = {
			gotPostData: false
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname != this.props.location.pathname) {
			window.location.reload();
		}
	}
	componentDidMount() {
		getPostData(this.props.match.params.event_id).then(snapshot => {
			const post = snapshot.val();
			if (!post) {
				this.setState({
					postNotFound: true
				});
			} else {
				this.setState({
					postData: post,
					gotPostData: true
				});
			}
		});
	}
	addPost = () => {
		const postData = this.state.postData;
		return (
			<Post
				id={this.props.match.params.event_id}
				author={postData.author}
				full_storage_uri={postData.full_storage_uri}
				full_url={postData.full_url}
				caption={postData.text}
				thumb_storage_uri={postData.thumb_url}
				thumb_url={postData.thumb_url}
			/>
		)
	}
	render() {
		if (this.state.postNotFound) {
			return (<Redirect to='/' />);
		}
		return (
			<div>
				{this.state.gotPostData && this.addPost()}
			</div>
		)
	}
}

export default PostPage;