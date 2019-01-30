import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileHeader = ({
  isCurrUser,
  currentUser,
  user,
  numFollowing,
  followers,
  loggedIn,
  history,
  updateFollow
  }) => {

  const toggleFollow = () => {
    if (loggedIn) {
      const newVal = !isFollowing;
      //TODO: reduxify this, make it an action.
      updateFollow(currentUser, user.uid, newVal);
    } else {
      // TODO: better handling of redirect to public landing!
      history.push('/');
    }
  }

  const numFollowers = followers.length;
  const isFollowing = currentUser ? followers.includes(currentUser.uid) : false;

  // grammar lol
  const followBtnText = isFollowing ? 'Following' : 'Follow';
  console.log(isFollowing)

  const settingsLink = (
    <div className='follow-btn'><Link to='/settings'>Settings</Link></div>
  );
  const followBtn = (
    <div className='follow-btn' onClick={toggleFollow}>{followBtnText}</div>
  );
  const bigBtn = isCurrUser ? settingsLink : followBtn;

  return (
    <div className='profile-header-container'>
      <div className='profile-header'>
        <div className='item username'>{user.username}</div>
        <div className='item stats-container'>
          <div className='follow-stats'>{numFollowers} / {numFollowing}</div>
          {bigBtn}
        </div>
      </div>
      <div className='profile-bio'>
        love waves, love music, hell yeah
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  isCurrUser: PropTypes.bool,
  currentUser: PropTypes.object,
  user: PropTypes.object,
  numFollowing: PropTypes.number,
  followers: PropTypes.array,
  loggedIn: PropTypes.bool
}

export default ProfileHeader;
