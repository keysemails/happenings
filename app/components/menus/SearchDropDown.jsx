import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
    const userResults = this.props.userResults.map((user, idx) => (
      <Link to={ `/user/${user.username}` } key={ idx }>
        <li>
            <p>
              <span>{ user.username }</span>
              <span>User</span>
            </p>
        </li>
      </Link>
    ));
    console.log(this.props.postResults)
    const postResults = this.props.postResults.map((post, idx) => (
      <Link to={ `/posts/${post.id}` } key={ idx }>
        <li>
          <img src={ post.thumb_url } />
            <p>
              <span>{ post.title }</span>
              <span>Post</span>
            </p>
        </li>
      </Link>
    ));

    const results = (this.props.searchedEntity == 'users') ?
      userResults : postResults;

    const hidden = (this.props.userResults.length === 0 &&
      this.props.postResults.length === 0) ? 'hidden' : '';

    return (
      <section className={ `search-dropdown ${hidden}`}>
        <ul className='entity-picker'>
          <li onClick={this.handleClick('users')}>Users</li>
          <li onClick={this.handleClick('posts')}>Posts</li>
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
  clearSearch: PropTypes.func
}

export default SearchResultDropdown;
