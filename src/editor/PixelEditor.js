import React from 'react';
import PropTypes from 'prop-types';
import Picture from './Picture';
import PictureCanvas from './PictureCanvas';

export default class PixelEditor extends React.Component {
  handlePointerDown = pos => {
    const tool = this.props.tools[this.props.tool];
    const onMove = tool(pos, this.props.picture, this.props.color, this.props.dispatch);
    if (onMove) return pos => onMove(pos, this.props.picture, this.props.color);
  };

  render() {
    return (
      <React.Fragment>
        <PictureCanvas picture={this.props.picture} pointerDown={this.handlePointerDown} />
        <br />
        {this.props.controls.map((Control, i) =>
          <React.Fragment key={i}>
            <Control tools={this.props.tools} dispatch={this.props.dispatch} />
            &nbsp;
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

PixelEditor.propTypes = {
  picture: PropTypes.instanceOf(Picture).isRequired, // Redux
  tool: PropTypes.string.isRequired, // Redux
  tools: PropTypes.arrayOf(PropTypes.func).isRequired,
  controls: PropTypes.objectOf(PropTypes.element).isRequired,
  dispatch: PropTypes.func.isRequired
};
