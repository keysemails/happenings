import React from 'react';
import { Link } from 'react-router-dom';
import CopyEventLink from './CopyEventLink';

// functionalities:
// 1 - copy post URL
// 2 - send invite(s)
// 3 - unfollow
// 4 - report event

const PostOptionsModal = ({currentUser, postId, followPostAuthor}) => {
  const reportEvent = () => {
    console.log('have not implemented this yet!')
  }
  const followHandler = () => {
    followPostAuthor(currentUser, postId)
  }
  return (
    <div>
      <div className='modal-option border-bottom' onClick={followHandler}>
        follow the author
      </div>
      <div className='modal-option border-bottom'>
        <CopyEventLink postId={postId} />
      </div>
      <div className='modal-option border-bottom' onClick={reportEvent}>
        [report event]
      </div>
      <div className='modal-option'>
        [send invites]
      </div>
    </div>
  )
}

export default PostOptionsModal;