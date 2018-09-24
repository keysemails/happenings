import React from 'react';
import { Link } from 'react-router-dom';

class PostHeader extends React.Component {
	render() {
		return (
			<div className='post-header'>
				<div className='post-author'>
					<Link to={`/user/${this.props.username}`}>
						{this.props.username}
					</Link>
				</div>
				<div className='modal-btn' onClick={this.props.toggleModal}>
					&middot;&middot;&middot;
				</div>
			</div>
		);
	}
}

export default PostHeader;