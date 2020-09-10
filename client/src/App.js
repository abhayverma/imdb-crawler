import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DataList from './Components/DataList'
import SearchBar from './Components/SearchBar'
import GlobalConfig from '../../global-config.json';

class App extends Component {
  state = {
    search: '',
    total: 0,
    items: [],
    ogItems: [],
    loading: true
  }

  getItems() {
    fetch(`${GlobalConfig.api.scrapeData}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ total: data.data.length, items: data.data, ogItems: data.data });
        this.setState({ loading: false })
      })
      .catch(err => alert(err))
  }

  updateState = (item) => {
    const itemIndex = this.state.items.findIndex(data => data.id === item.id)
    const newArray = [
      // destructure all items from beginning to the indexed item
      ...this.state.items.slice(0, itemIndex),
      // add the updated item to the array
      item,
      // add the rest of the items to the array from the index after the replaced item
      ...this.state.items.slice(itemIndex + 1)
    ]
    this.setState({ items: newArray })
  }

  moviesFilterOnChange = (event) => {
    const filteredItems = this.state.ogItems.filter(record => event.target.value &&
      ((record.title + record.year).match(new RegExp(event.target.value, 'ig'))));
    this.setState({
      total: event.target.value ? filteredItems.length : this.state.ogItems.length,
      search: event.target.value,
      items: event.target.value ? filteredItems : this.state.ogItems
    })
  }

  componentDidMount() {
    this.getItems()
  }

  render() {
    const { loading } = this.state;
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>IMDB Listing <small>[Total: {this.state.total}]</small></h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <SearchBar search={this.state.search} moviesFilterOnChange={this.moviesFilterOnChange} />
          </Col>
        </Row>
        <center>
          <h4 style={{ display: loading ? 'block' : 'none', justifyContent: 'center', alignItems: 'center' }}>Please wait ... crawling IMDB top movie listing</h4>
        </center>
        <Row>
          <Col>
            <DataList items={this.state.items} updateState={this.updateState} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
