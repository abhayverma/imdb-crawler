import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import DataList from './Components/DataList';
import SearchBar from './Components/SearchBar';
import Button from '@material-ui/core/Button';
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
    this.setState({ loading: true });
    fetch(`${GlobalConfig.api.search}`)
      .then(response => response.json())
      .then(data => this.setState({ total: data.data.length, items: data.data, ogItems: data.data, loading: false }))
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

  triggerCrawler = () => {
    this.setState({ loading: true });
    fetch(`${GlobalConfig.api.reCrawl}`)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({ total: response.data.length, ogItems: response.data, loading: false });
        } else {
          alert('Something went wrong');
          this.setState({ loading: false });
        }
      })
      .catch(err => alert(err))
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
            <Button variant="contained" color="primary" onClick={this.triggerCrawler} style={{ position: 'absolute', top: 25, right: 25 }} disabled={loading}>Recrawl IMDB</Button>
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
