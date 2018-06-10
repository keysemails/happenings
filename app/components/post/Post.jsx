import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getAuth } from '../../utils/auth';
import { toArray } from '../../utils/index';
import { fetchComments, registerUserToLike, addComment, subscribeToComments,
	registerForLikesCount, registerForCommentsCount, updateLike as _updateLike,
	updateAttending, registerUserAttendance, registerForAttendingCount
} from '../../utils/post';

import PostStats from './PostStats.jsx';
import Comment from './Comment.jsx';
import AddCommentInput from './AddCommentInput.jsx';

class Post extends React.Component {
	constructor() {
		super();
		this.auth = getAuth();
		this.state = {
			comments: [],
			gotComments: false,
			nextPage: null,
			mostRecentComment: null,
		}
	}
	componentWillMount() {
		this.setState({_isMounted: true});
	}
	componentWillUnmount() {
		this.setState({_isMounted: false});
	}
	safeSetState = (state) => {
		if (this.state._isMounted) {
			this.setState(state);
		}
	}
	listenForNewComments = () => {
		subscribeToComments(this.props.id, this.state.mostRecentComment,
			(key, commentData) => {
				const newComment = {...commentData, key};
				const currentComments = this.state.comments;
				this.safeSetState({
					comments: currentComments.concat([newComment])
				});
			}
		)
	}
	componentDidMount() {
		this.loadPostStats();
		const postId = this.props.id;
		fetchComments(postId).then(data => {
			const comments = toArray(data.entries);
			const latestId = Object.keys(data.entries)[comments.length - 1];
			this.safeSetState({
				comments: comments,
				gotComments: true,
				nextPage: data.nextPage,
				mostRecentComment: latestId
			});
			this.listenForNewComments();
		});
	}
	loadPostStats = () => {
		// I need sagas this is messy
		if (this.auth.currentUser) {
			registerUserToLike(this.props.id, isLiked => {
				this.safeSetState({ isLiked });
			});
			registerUserAttendance(this.props.id, isAttending => {
				this.safeSetState({ isAttending });
			});
		} else {
			this.safeSetState({ isLiked: false, isAttending: false});
		}
		registerForLikesCount(this.props.id, likeCount => {
			this.safeSetState({ likeCount });
		});
		registerForAttendingCount(this.props.id, attendingCount => {
			this.safeSetState({ attendingCount });
		});
	}
	loadMoreComments = () => {
		let currentComments = this.state.comments;
		let getNextPage = this.state.nextPage;
		getNextPage().then(data => {
			this.safeSetState({
				comments: currentComments.concat(toArray(data.entries)),
				gotComments: true,
				nextPage: data.nextPage,
			});
		});
	}
	addPostComments() {
		const commentData = this.state.comments.sort((a, b) => {
			return a.timestamp - b.timestamp
		});
		return Object.keys(commentData).map(key => {
			const comment = commentData[key];
			return (
				<Comment
					key={key}
					author={comment.author}
					text={comment.text}
				/>
			)
		});
	}
	updateLike(postId, val) {
		if (this.auth.currentUser) {
			_updateLike(postId, val);
		} else {
			// TODO: redirect to the public landing page
			console.log('create an account!');
		}
	}
	updateAttend(postId, val) {
		if (this.auth.currentUser) {
			updateAttending(postId, this.props.event_timestamp, val);
		} else {
			// TODO redirect to the public landing page
			console.log('make an account!!');
		}
	}
	submitComment = (text) => {
		if (this.auth.currentUser) {
			addComment(this.auth.currentUser, this.props.id, text)
		}
	}
	render() {
		const nextPageBtn = this.state.nextPage ? (
			<div className='more-comments-btn'>
				<span
					className='more-comments-btn text'
					onClick={this.loadMoreComments}
				>~ load more comments ~</span>
			</div>
		) : null;
		const authorLink = (
			<Link to={`/user/${this.props.author.username}`}>
				{this.props.author.username}
			</Link>
		);
		return (
			<div className='post-container'>
				<div className='post-author'>{authorLink}</div>
				<img src={this.props.full_url} height="300" width="300"></img>
				<PostStats
					likeCount={this.state.likeCount}
					attendingCount={this.state.attendingCount}
					isLiked={this.state.isLiked}
					isAttending={this.state.isAttending}
					updateLike={(val) => this.updateLike(this.props.id, val)}
					updateAttending={(val) => this.updateAttend(this.props.id, val)}
				/>
				<div className='comments-container'>
					{/*The first comment is the post status!*/}
					<Comment
						author={this.props.author}
						text={this.props.caption}
					/>
					{nextPageBtn}
					{this.state.gotComments && this.addPostComments()}
					<AddCommentInput
						addComment={this.submitComment}
					/>
				</div>
			</div>
		)
	}
}

Post.propTypes = {
	id: PropTypes.string,
	author: PropTypes.object,
	full_storage_uri: PropTypes.string,
	full_url: PropTypes.string,
	caption: PropTypes.string,
	thumb_storage_uri: PropTypes.string,
	event_timestamp: PropTypes.number,
	title: PropTypes.string,
	location: PropTypes.string,
	description: PropTypes.string,
};

export default Post;