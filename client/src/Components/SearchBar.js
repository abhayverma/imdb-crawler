import React, { Component } from 'react'
import { FormGroup, Input } from 'reactstrap';

class SearchBar extends Component {
  render() {
    return (
      <FormGroup>
        <Input style={{ width: '80%', marginBottom: 20, padding: 10 }} onChange={this.props.moviesFilterOnChange} type="text" name="email" id="searchBar" placeholder="Search for a movie by name or year of release" />
      </FormGroup>
    )
  }
}

export default SearchBar
