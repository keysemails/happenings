import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';

class InboxHeader extends React.Component {
	render() {
		const back = '< back';
		const subtext = `You have ${this.props.inviteCount} unread notifications`;
		return (
			<div className='nav-bar-container'>
				<header>
					<div className='inline-centered'>
						<Link to='/'>{back}</Link>
						<h1 className='logo inline-centered'>HAPPENINGS</h1>
					</div>
				</header>
			</div>
		)
	}
}

InboxHeader.propTypes = {
	inviteCount: PropTypes.number,
}

export default InboxHeader;