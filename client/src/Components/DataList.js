import React, { Component } from 'react'
import CardItem from "./Card";
import Grid from "@material-ui/core/Grid";

class DataList extends Component {
  render() {
    let index = 1;
    const items = this.props.items.map(item => {
      item.index = index;
      return (
        <Grid item md={3} key={index++}>
          <CardItem info={item} />
        </Grid>

      )
    })

    return (
      <Grid container spacing={3}>
        {items}
      </Grid>
    )
  }
}

export default DataList
