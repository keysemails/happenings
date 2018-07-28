import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';

class InboxHeader extends React.Component {
	render() {
		const back = '< back';
		const backLink = (<NavLink to='/'>{back}</NavLink>)
		const subtext = `You have been invited to ${this.props.inviteCount} events`;
		return (
			<div className='nav-bar-container'>
				<header>
					<div className='inline-centered'>
						{backLink}
						<h1 className='logo inline-centered'>INBOX</h1>
					</div>
				</header>
				{subtext}
			</div>
		)
	}
}

InboxHeader.propTypes = {
	inviteCount: PropTypes.number,
}

export default InboxHeader;