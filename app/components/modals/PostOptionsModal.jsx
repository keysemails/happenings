import React from 'react';
import { Link } from 'react-router-dom';
import CopyEventLink from './CopyEventLink';
import { getAuthorByPostId, updateFollow } from '../../utils/user';

// functionalities:
// 1 - copy post URL
// 2 - send invite(s)
// 3 - unfollow
// 4 - report event

class PostOptionsModal extends React.Component {
	state = {
		unfollowText: 'unfollow the author'
	}
	unfollowAuthor = () => {
		return getAuthorByPostId(this.props.postId).then(res => {
			const author = res.val();
			return updateFollow(this.props.currentUser, author.uid, false);
		}).then(() => {
			this.setState({unfollowText: 'unfollowed!'});
			window.location.reload();
		});
	}
	reportEvent = () => {
		console.log('have not implemented this yet!')
	}
	render() {
		return (
			<div>
				<div className='modal-option border-bottom' onClick={this.unfollowAuthor}>
					{this.state.unfollowText}
				</div>
				<div className='modal-option border-bottom'>
					<CopyEventLink postId={this.props.postId} />
				</div>
				<div className='modal-option border-bottom' onClick={this.reportEvent}>
					[report event]
				</div>
				<div className='modal-option'>
					[send invites]
				</div>
			</div>
		)
	}
}

export default PostOptionsModal;