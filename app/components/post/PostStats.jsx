import React from 'react';
import PropTypes from 'prop-types';

class PostStats extends React.Component {
  updateLike = () => {
    const newVal = !this.props.isLiked;
    this.props.updateLike(newVal);
  }
  updateAttending = () => {
    const newVal = !this.props.isAttending;
    this.props.updateAttending(newVal);
  }
  render() {
    // grammar lol
    const likesNoun = this.props.likeCount == 1 ? 'star' : 'stars';
    const likeBtnText = this.props.isLiked ? 'starred' : 'star';
    const attendBtnTxt = this.props.isAttending ? 'Attending!' : 'Attend';
    return (
      <div>
        <div>{`${this.props.likeCount} ${likesNoun}`}</div>
        <div>{`${this.props.attendingCount} attending`}</div>
        <button onClick={this.updateLike}>{likeBtnText}</button>{' '}
        <button onClick={this.updateAttending}>{attendBtnTxt}</button>
      </div>
    );
  }
}
PostStats.propTypes = {
  likeCount: PropTypes.number,
  attendingCount: PropTypes.number,
  isLiked: PropTypes.bool,
  updateLike: PropTypes.func,
  isAttending: PropTypes.bool,
  updateAttending: PropTypes.func
}
export default PostStats;
