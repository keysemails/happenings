import { connect } from 'react-redux';

import Search from './search';
import { searchUsers } from '../../actions/user_actions';
import { searchPosts } from '../../actions/post_actions';
import { clearSearch } from '../../actions/ui_actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  searchUsers: (query) => dispatch(searchUsers(query)),
  searchPosts: (query) => dispatch(searchPosts(query)),
  clearSearch: () => dispatch(clearSearch())
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
