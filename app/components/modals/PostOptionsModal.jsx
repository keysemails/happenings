import React from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUserByPostId, updateFollow } from '../../utils/user';

// functionalities:
// 1 - copy post URL
// 2 - send invite(s)
// 3 - unfollow
// 4 - report event

class PostOptionsModal extends React.Component {
	unfollowAuthor = () => {
		return getUserByPostId(this.props.postId).then(res => {
			const authorUid = res.val().uid;
			return updateFollow(this.props.currentUser.uid, authorUid, false);
		}).then(() => {
			console.log('unfollowed');
			window.location.reload();
		});
	}
	render() {
		const copyText = `${window.location.host}/event/${this.props.postId}`;
		return (
			<div>
				<div>
					I am a modal for {this.props.postId}
				</div>
				<div onClick={this.unfollowAuthor}>
					[unfollow the author]
				</div>
				<CopyToClipboard text={copyText}>
					<span>[copy to clipboard]</span>
				</CopyToClipboard>
			</div>
		)
	}
}

export default PostOptionsModal;