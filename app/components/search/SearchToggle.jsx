import React from 'react';
import { connect } from 'react-redux';
import { toggleBar } from '../../actions/ui_actions';

import magnifyingGlass from '../../assets/magnifying_glass.svg'


const SearchToggle = ({ toggleBar }) => {
  return <img onClick={ toggleBar } src={ magnifyingGlass } />
}

const mapDispatchToProps = dispatch => ({
  toggleBar: () => dispatch(toggleBar())
});

export default connect(
  null,
  mapDispatchToProps
)(SearchToggle);
