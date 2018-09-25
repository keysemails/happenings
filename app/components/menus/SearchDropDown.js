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

  render() {
    const userResults = this.props.userResults.map((user, idx) => (
      // <Link to={ `/users/${user.id}` } key={ idx }>
      // <li>
      //     <img src={ user.thumbnailProfileImgUrl } />
      //     <p>
      //       <span>{ user.username }</span>
      //       <span>User</span>
      //     </p>
      // </li>
      // </Link>
      <li key={ idx }>{user.username}</li>
    ));

    const postResults = this.props.postResults.map((post, idx) => (
      // <Link to={ `/posts/${post.id}` } key={ idx }>
      // <li>
      //   <img src={ post.thumbnailCoverUrl } />
      //     <p>
      //       <span>{ post.title }</span>
      //       <span>{ post.artist }</span>
      //       <span>Album</span>
      //     </p>
      // </li>
      // </Link>
      <li key={ idx }>{post.title}</li>
    ));

    const hidden = (this.props.userResults.length === 0 &&
      this.props.postResults.length === 0) ? 'hidden' : '';

    return (
      <ul className={ `search-dropdown ${hidden}` }>
        { userResults }
        { postResults }
      </ul>
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
