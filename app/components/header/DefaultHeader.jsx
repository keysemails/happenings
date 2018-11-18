import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import NavButtons from './NavButtons';

const DefaultHeader = ({currentUser, loggedIn, unreadNotificationCount, logOut}) => {
	const logOutBtn = (<button onClick={logOut}>Sign out</button>);
	const logInBtn = (<NavLink to='/login'>Log in</NavLink>);
	return (
		<div className='nav-bar-container'>
			<header className='inline-centered'>
				{ loggedIn ? logOutBtn : logInBtn }
				<Link to='/' ><h1 className='logo'>HAPPENINGS</h1></Link>
				{ loggedIn && <Link to='/inbox' className='notification-count'>{unreadNotificationCount}</Link> }
			</header>

			{ loggedIn && <NavButtons currentUser={currentUser} /> }
		</div>
	);
}

export default DefaultHeader;