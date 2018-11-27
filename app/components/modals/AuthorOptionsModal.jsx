import React from 'react';
import PropTypes from 'prop-types';
import CopyEventLink from './CopyEventLink';
import { Link } from 'react-router-dom';

// functionalities:
// 1 - edit post (take to new page)
// 2 - delete post
// 3 - copy post URL
class AuthorOptionsModal extends React.Component {
  render() {
    return (
      <div>
        <div className='modal-option border-bottom'>
          <Link
            to={`/event/${this.props.postId}/edit`}
            onClick={this.props.closeModal}
          >[edit post]</Link>
        </div>
        <div className='modal-option border-bottom'>
          <CopyEventLink postId={this.props.postId} />
        </div>
      </div>
    )
  }
}

export default AuthorOptionsModal;

