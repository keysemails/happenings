import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames'

class SearchResultDropdown extends React.Component {
  // install single use click handler on window only when the dropdown appears
    // ie when the dropdown is empty and is about to be populated
  componentWillReceiveProps({userResults, postResults}) {
    if (this.props.userResults.length === 0 &&
      this.props.postResults.length === 0 &&
      (userResults.length > 0 || postResults.length > 0)) {
      window.addEventListener('click', this.props.clearSearch, {once: true} );
    }
  }

  handleClick(entity) {
    return e => {
      e.preventDefault()
      e.stopPropagation()
      this.props.updateSearchedEntity(entity)
    }
  }

  render() {
    const { searchedEntity, userResults, postResults } = this.props

    const userList = userResults.map((user, idx) => (
      <Link to={ `/user/${user.username}` } key={ idx }>
        <li>
            <p>
              <span>{ user.username }</span>
              <span>User</span>
            </p>
        </li>
      </Link>
    ));
    console.log(postResults);

    const postList = postResults.map((post, idx) => (
      <Link to={ `/events/${idx}` } key={ idx }>
        <li>
          <img src={ post.thumb_url } />
            <section className='post-result'>
              <strong className='post-title'>{ post.title }</strong>
                <p className='post-details'>
                  <span>Post</span>
                  <span>Post</span>
                </p>
            </section>
        </li>
      </Link>
    ));

    const usersSelected = (searchedEntity == 'users') ? 'selected' : ''
    const postsSelected = (searchedEntity == 'posts') ? 'selected' : ''
    const results = (searchedEntity == 'users') ? userList : postList

    const hidden = (userResults.length === 0 &&
      postResults.length === 0) ? 'hidden' : '';

    return (
      <section className={ `search-dropdown ${hidden}`}>
        <ul className='entity-picker'>
          <li className={ usersSelected } onClick={this.handleClick('users')}>Users</li>
          <li className={ postsSelected } onClick={this.handleClick('posts')}>Posts</li>
        </ul>
        <ul className='results'>
        { results }
        </ul>
      </section>
    );
  }
}

SearchResultDropdown.defaultProps = {
  userResults: [],
  postResults: []
}

SearchResultDropdown.propTypes = {
  userResults: PropTypes.array,
  postResults: PropTypes.array,
  clearSearch: PropTypes.func,
  updateSearchedEntity: PropTypes.func
}

export default SearchResultDropdown;
