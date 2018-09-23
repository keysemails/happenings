import React from 'react';
import { NavLink } from 'react-router-dom';

class DefaultHeader extends React.Component {
	render() {
		const logOutBtn = (<button onClick={this.props.logOut}>Sign out</button>);
		const logInBtn = (<NavLink to='/login'>Log in</NavLink>);
		const authLink = this.props.loggedIn ? logOutBtn : logInBtn;
		const inboxLink = (<NavLink to='/inbox'>Inbox</NavLink>);
		const navBar = (
			<nav className='main-nav'>
				<ul className='inline-centered'>
					<li><NavLink exact to='/'>Feed</NavLink></li>
					<li><NavLink to='/discover'>Discover</NavLink></li>
					<li><NavLink to='/create'>Create</NavLink></li>
					<li><NavLink to={`/user/${this.props.currentUser.username}`}>Profile</NavLink></li>
				</ul>
			</nav>
		);
		return (
			<div className='nav-bar-container'>
				<header>
					<div className='inline-centered'>
					{authLink}
					<NavLink to='/' ><h1 className='logo'>HAPPENINGS</h1></NavLink>
					<div className='inbox-link'>{inboxLink}</div>
					</div>
				</header>

				{ this.props.loggedIn && navBar }
			</div>
		)
	}
}

export default DefaultHeader;