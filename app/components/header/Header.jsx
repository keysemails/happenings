import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import InboxHeader from './InboxHeader';
import SearchContainer from '../search/SearchContainer';
import SearchToggle from '../search/SearchToggle';

const Header = ({currentUser, logOut, loggedIn}) => {
	const logOutBtn = (<button onClick={logOut}>Sign out</button>);
	const logInBtn = (<NavLink to='/login'>Log in</NavLink>);
	const inboxHeader = (
		<InboxHeader inviteCount={3} />
	);
	const defaultHeader = (
		<div className='nav-bar-container'>
			<header className='inline-centered'>
				{ loggedIn ? logOutBtn : logInBtn }
				<Link to='/' ><h1 className='logo'>HAPPENINGS</h1></Link>
				{ loggedIn ? <Link to='/inbox'>Inbox</Link> : null }
			</header>

			{ loggedIn &&
				<nav className='main-nav'>
					<ul>
						<li><NavLink className='nav-button' exact to='/'>Feed</NavLink></li>
						<li><NavLink className='nav-button' to='/discover'>Discover</NavLink></li>
						<li><NavLink className='nav-button' to='/create'>Create</NavLink></li>
						<li><NavLink className='nav-button' to={`/user/${currentUser.username}`}>Profile</NavLink></li>
						<SearchToggle />
					</ul>
					<SearchContainer />
				</nav>
			}
		</div>
	)
	const isInbox = window.location.pathname === '/inbox';
	return ( isInbox ? inboxHeader : defaultHeader)
}

export default Header;
