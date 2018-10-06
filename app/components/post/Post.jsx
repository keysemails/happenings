import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getAuth } from '../../utils/auth';
import { toArray as _toArray } from '../../utils/index';
import { fetchComments, registerUserToLike, addComment, subscribeToComments,
	registerForCommentsCount, updateLike as _updateLike, deletePost as _deletePost,
	updateAttending, registerUserAttendance, deleteComment as _deleteComment
} from '../../utils/post';

import PostHeader from './PostHeader.jsx';
import PostStats from './PostStats.jsx';
import Comment from './Comment.jsx';
import AddCommentInput from './AddCommentInput.jsx';

class Post extends React.Component {
	constructor() {
		super();
		this.auth = getAuth() ;
		this.state = {
			comments: [],
			gotComments: false,
			nextPage: null,
			mostRecentComment: null,
		}
	}
	componentDidMount() {
		this.setState({_isMounted: true});
		this.loadPostStats();

		const postId = this.props.id;
		fetchComments(postId).then(data => {
			const comments = _toArray(data.entries);
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
	loadPostStats = () => {
		this.props.registerForLikesCount(this.props.id);
		this.props.registerForAttendingCount(this.props.id);
	}
	loadMoreComments = () => {
		let currentComments = this.state.comments;
		let getNextPage = this.state.nextPage;
		getNextPage().then(data => {
			this.safeSetState({
				comments: currentComments.concat(_toArray(data.entries)),
				gotComments: true,
				nextPage: data.nextPage,
			});
		});
	}
	addPostComments() {
		const commentData = this.state.comments.sort((a, b) => {
			return a.timestamp - b.timestamp
		});
		return Object.keys(commentData).map(idx => {
			const comment = commentData[idx];
			return (
				<Comment
					key={comment.key}
					id={comment.key}
					author={comment.author}
					text={comment.text}
					currentUID={this.auth.currentUser.uid}
					deleteComment={(key) => this.deleteComment(comment.key)}
				/>
			)
		});
	}
	updateLike(val) {
		if (this.auth.currentUser) {
			const { currentUser, id, event_timestamp,} = this.props;
			_updateLike(currentUser, id, event_timestamp, val);
		} else {
			// TODO: redirect to the public landing page
			console.log('create an account!');
		}
	}
	updateAttend(postId, val) {
		if (this.auth.currentUser) {
			const { currentUser, id, event_timestamp } = this.props;
			updateAttending(currentUser, id, event_timestamp, val);
		} else {
			// TODO redirect to the public landing page
			console.log('make an account!!');
		}
	}
	submitComment = (text) => {
		if (this.auth.currentUser) {
			const { currentUser, event_timestamp, id } = this.props;
			addComment(currentUser, id, event_timestamp, text);
		}
	}
	deleteComment = (commentId) => {
		_deleteComment(this.props.id, commentId).then(res => {
			// TODO: this is kind of shitty in that
			// it assumes the DB update succeeds.
			let newComments = [];
			this.state.comments.forEach(comment => {
				if (comment.key !== commentId) {
					newComments.push(comment);
				}
			});
			this.safeSetState({
				comments: newComments
			});
		});
	}
	deletePost = () => {
		const {id, full_storage_uri, thumb_storage_uri } = this.props;
		_deletePost(id, full_storage_uri, thumb_storage_uri).then(res => {
			console.log('Deleted post ', id);
			//TODO: better handling of this
			window.location.reload();
		});
	}
	toggleModal = (currUserIsAuthor) => {
		if (this.props.postOptionsModalOpen) {
			this.props.closePostOptionsModal();
		} else {
			if (currUserIsAuthor) {
				this.props.openAuthorOptionsModal(this.props.id);
			} else {
				this.props.openPostOptionsModal(this.props.id);
			}
		}
	}
	render() {
		const { attendees, likers, currUserLiked, currUserAttending } = this.props;
		const numLikes = likers ? Object.keys(likers).length : 0;
		const numAttendees = attendees ? Object.keys(attendees).length : 0;
		const currUserIsAuthor = (this.props.author.uid === this.auth.currentUser.uid);
		const deletePostBtn = currUserIsAuthor ? (
			<div className='delete-post-btn' onClick={this.deletePost}>
			[x]
			</div>
		) : null;
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
				<PostHeader
					username={this.props.author.username}
					toggleModal={() => this.toggleModal(currUserIsAuthor)}
				/>
				<Link to={`/event/${this.props.id}`}>
					<img src={this.props.full_url} height="300" width="300"></img>
				</Link>
				<PostStats
					likeCount={numLikes}
					attendingCount={numAttendees}
					isLiked={currUserLiked}
					isAttending={currUserAttending}
					updateLike={(val) => this.updateLike(val)}
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
