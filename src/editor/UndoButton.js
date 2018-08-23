import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Picture from './Picture';

export class UndoButton extends React.Component {
  handleClick = () => this.props.dispatch({ undo: true });

  render() {
    return <button onClick={this.handleClick} disabled={this.props.done.length === 0}>⮪ Undo</button>
  }
}

UndoButton.propTypes = {
  done: PropTypes.arrayOf(PropTypes.instanceOf(Picture)).isRequired, // Redux
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return { done: state.done };
}

export default connect(mapStateToProps)(UndoButton);
