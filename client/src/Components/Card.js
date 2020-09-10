import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GlobalConfig from '../../../global-config.json';

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12,
    marginTop: 6,
    fontWeight: 'bold'
  }
};

function SimpleCard(props) {
  const { classes } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            {props.info.index}
            <span style={{ float: 'right', textDecoration: 'underline' }}>{props.info.certificate}</span>
          </Typography>
          <Typography variant="h4" component="h4">
            {props.info.title} {props.info.year}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {bull} {props.info.rating} &nbsp; {bull} {props.info.runTime}
          </Typography>
          <Typography component="p">
            {props.info.description}
          </Typography>
        </CardContent>
        <CardActions>
          <a target="_blank" href={GlobalConfig.api.imdbUrl + props.info.link}>
            <Button size="small">Know More</Button>
          </a>
        </CardActions>
      </Card>
    </div>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
