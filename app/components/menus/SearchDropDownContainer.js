import { connect } from 'react-redux';

import SearchResultDropdown from './SearchDropdown.jsx';
import { selectUserResults, selectPostResults } from '../../reducers/selectors';
import { clearSearch, updateSearchedEntity } from '../../actions/ui_actions';


const mapStateToProps = state => ({
  userResults: selectUserResults(state),
  postResults: selectPostResults(state),
  searchedEntity: state.ui.search.searchedEntity
});

const mapDispatchToProps = dispatch => ({
  clearSearch: () => dispatch(clearSearch()),
  updateSearchedEntity: (entity) => dispatch(updateSearchedEntity(entity))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultDropdown);
