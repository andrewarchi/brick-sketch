import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ToolSelect extends React.Component {
  handleChange = event => this.props.dispatch({ tool: event.target.value });

  render() {
    return (
      <label>
        🖌 Tool:&nbsp;
        <select value={this.props.tool} onChange={this.handleChange}>
          {Object.keys(this.props.tools).map(name =>
            <option key={name}>{name}</option>
          )}
        </select>
      </label>
    );
  }
}

ToolSelect.propTypes = {
  tool: PropTypes.string.isRequired, // Redux
  tools: PropTypes.objectOf(PropTypes.func).isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return { tool: state.tool };
}

export default connect(mapStateToProps)(ToolSelect);
