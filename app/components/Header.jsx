import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import SearchContainer from './search/SearchContainer';

const Header = ({currentUser, logOut, loggedIn}) => {
	const logOutBtn = (<button onClick={logOut}>Sign out</button>);
	const logInBtn = (<NavLink to='/login'>Log in</NavLink>);
	const authLink = loggedIn ? logOutBtn : logInBtn;

	return (
		<div className='nav-bar-container'>
			<header><Link to='/' ><h1 className='logo'>HAPPENINGS</h1></Link>{authLink}</header>

			{ loggedIn &&
				<nav className='main-nav'>
					<ul>
						<li><NavLink exact to='/'>Feed</NavLink></li>
						<li><NavLink to='/discover'>Discover</NavLink></li>
						<li><NavLink to='/create'>Create</NavLink></li>
						<li><NavLink to={`/user/${currentUser.username}`}>Profile</NavLink></li>
					</ul>
					<SearchContainer />
				</nav>
			}
		</div>
	)
}

export default Header;
