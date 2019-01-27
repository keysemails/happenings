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
    const showDelete = (
      !!this.props.currentUser &&
      this.props.currentUser.uid === this.props.author.uid
    );
    const authorName = this.props.author.username;
    const deleteBtn = showDelete ? (
      <button onClick={this.props.deleteComment}>
      [x]
      </button>
    ) : null;
    return (
      <div className='comment'>
        <Link
          to={authorUrl}>{authorName}
        </Link> {this.props.text} <span>{deleteBtn}</span>
      </div>
    )
  }
}

Comment.propTypes = {
  id: PropTypes.string,
  author: PropTypes.object,
  text: PropTypes.string,
  deleteComment: PropTypes.func,
  showDelete: PropTypes.bool,
};
export default Comment;