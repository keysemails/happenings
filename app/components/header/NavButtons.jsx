import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import SearchContainer from '../search/SearchContainer';
import SearchToggle from '../search/SearchToggle';

const NavButtons = ({currentUser}) => {
  return (
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
  )
}

export default NavButtons;