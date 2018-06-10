import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Comment extends React.Component {
	handleDeleteClick = () => {
		if (this.props.author.username == this.props.currentUsername) {
			this.props.deleteComment(this.props.id);
		}
	}
	render() {
		const authorUrl = `/user/${this.props.author.username}`
		const authorName = this.props.author.username;
		return (
			<div className='comment'>
				<Link to={authorUrl}>{authorName}</Link> {this.props.text}
			</div>
		)
	}
}

Comment.propTypes = {
	id: PropTypes.string,
	author: PropTypes.object,
	text: PropTypes.string,
	currentUsername: PropTypes.string,
	deleteComment: PropTypes.func,
};
export default Comment;