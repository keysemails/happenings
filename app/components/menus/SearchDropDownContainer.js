import { connect } from 'react-redux';

import SearchResultDropdown from './SearchDropdown';
import { selectUserResults, selectPostResults } from '../../reducers/selectors';
import { clearSearch } from '../../actions/ui_actions';


const mapStateToProps = state => ({
  userResults: selectUserResults(state),
  albumResults: selectPostResults(state)
});

const mapDispatchToProps = dispatch => ({
  clearSearch: () => dispatch(clearSearch())
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultDropdown);
