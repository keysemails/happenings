import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import InboxHeader from './InboxHeader.jsx';
import DefaultHeader from './DefaultHeader.jsx';

class Header extends React.Component {
	render() {
		const isInbox = this.props.location.pathname === '/inbox';
		const inboxHeader = (
			<InboxHeader
				inviteCount={3}
			/>
		)
		const defaultHeader = (
			<DefaultHeader
				logOut={this.props.logOut}
				loggedIn={this.props.loggedIn}
				currentUser={this.props.currentUser}
			/>
		);
		return (
			<div>{ isInbox ? inboxHeader : defaultHeader }</div>
		)
	}
}

export default Header;
