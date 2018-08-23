import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class ColorSelect extends React.Component {
  handleChange = event => this.props.dispatch({ color: event.target.value });

  render() {
    return (
      <label>
        🎨 Color:&nbsp;
        <input type="color" value={this.props.color} onChange={this.handleChange} />
      </label>
    );
  }
}

ColorSelect.propTypes = {
  color: PropTypes.string.isRequired, // Redux
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return { color: state.color };
}

export default connect(mapStateToProps)(ColorSelect);
