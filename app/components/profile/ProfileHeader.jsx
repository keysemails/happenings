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
  const numEvents = user.posts ? Object.keys(user.posts).length : 0;
  const isFollowing = currentUser ? followers.includes(currentUser.uid) : false;

  // grammar lol
  const followNoun = numFollowers == 1 ? 'follower' : 'followers';
  const eventsNoun = numEvents == 1 ? 'event' : 'events';
  const followBtnText = isFollowing ? 'U R Following' : 'Follow';

  const settingsLink = (
    <div><Link to='/settings'>settings</Link></div>
  );
  const followBtn = (
    <div onClick={toggleFollow}>{followBtnText}</div>
  );
  const btn = isCurrUser ? settingsLink : followBtn;

  return (
    <div>
      <div>{`${numEvents} ${eventsNoun}`}</div>
      <div>{`${numFollowers} ${followNoun}`}</div>
      <div>{`${numFollowing} following`}</div>
      {btn}
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
