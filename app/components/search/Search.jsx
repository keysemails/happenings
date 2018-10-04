import React from 'react';
import SearchResultDropdownContainer from '../menus/SearchDropdownContainer';
import classNames from 'classnames'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.executeQuery = this.executeQuery.bind(this);
    this.handleEsc = this.handleEsc.bind(this);
  }

  executeQuery() {
    if (this.props.searchedEntity == 'users') {
      this.props.searchUsers(this.state.query);
    } else {
      this.props.searchPosts(this.state.query);
    }
  }

  handleEsc(e) {
    if (e.key === 'Escape') {
      this.props.clearSearch();
      this.setState({ query: '' });
    }
  }

  handleChange(e) {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.setState({query: e.currentTarget.value}, () =>  {
      this.timeOut = setTimeout(this.executeQuery, 300);
    });
  }

  render() {
    const containerClass = classNames('search-container', { folded: !this.props.barOpen })

    return(
      <div className={ containerClass }>
        <div className='search-field-container'>
          <input
            className='search-field'
            type='text'
            placeholder='Search'
            onChange={ this.handleChange }
            onKeyDown={ this.handleEsc }
            onClick={ e => e.stopPropagation() }
            value={ this.state.query }
            >
          </input>
          <div className='search-offset-box'></div>
        </div>
        <SearchResultDropdownContainer />
      </div>
    );
  }
}
// onBlur={ () => this.setState({ query: ''})}

export default Search;
