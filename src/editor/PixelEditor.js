import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Picture from './Picture';
import PictureCanvas from './PictureCanvas';

class PixelEditor extends React.Component {
  handlePointerDown = pos => {
    const tool = this.props.tools[this.props.tool];
    const onMove = tool(pos, this.props.picture, this.props.color, this.props.dispatch);
    if (onMove) return pos => onMove(pos, this.props.picture, this.props.color);
  };

  render() {
    return (
      <React.Fragment>
        <PictureCanvas picture={this.props.picture} pointerDown={this.handlePointerDown} />
        <section>
          {this.props.controls.map((Control, i) =>
            <React.Fragment key={i}>
              <Control tools={this.props.tools} dispatch={this.props.dispatch} />
              &nbsp;
            </React.Fragment>
          )}
        </section>
      </React.Fragment>
    );
  }
}

PixelEditor.propTypes = {
  picture: PropTypes.instanceOf(Picture).isRequired, // Redux
  tool: PropTypes.string.isRequired, // Redux
  tools: PropTypes.objectOf(PropTypes.func).isRequired,
  controls: PropTypes.arrayOf(PropTypes.func).isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    picture: state.picture,
    tool: state.tool
  };
}

export default connect(mapStateToProps)(PixelEditor);
