import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getAuth } from '../../utils/auth';
import { toArray } from '../../utils/index';
import { fetchComments, registerUserToLike, addComment, subscribeToComments,
	registerForCommentsCount, updateLike as _updateLike,
	updateAttending, registerUserAttendance
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
	componentWillUnmount() {
		this.setState({_isMounted: false});
		this.props.removeListener('likers', this.props.id);
		this.props.removeListener('attendees', this.props.id);
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
		this.setState({_isMounted: true});
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
		this.props.registerForLikesCount(this.props.id);
		this.props.registerForAttendingCount(this.props.id);
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
		console.log(commentData);
		return Object.keys(commentData).map(key => {
			const comment = commentData[key];
			return (
				<Comment
					key={key}
					id={key}
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
		const { attendees, likers, currUserLiked, currUserAttending } = this.props;
		const numLikes = likers ? Object.keys(likers).length : 0;
		const numAttendees = attendees ? Object.keys(attendees).length : 0;

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
					likeCount={numLikes}
					attendingCount={numAttendees}
					isLiked={currUserLiked}
					isAttending={currUserAttending}
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
	currentUsername: PropTypes.string,
	event_timestamp: PropTypes.number,
	title: PropTypes.string,
	location: PropTypes.string,
	description: PropTypes.string,
};

export default Post;
