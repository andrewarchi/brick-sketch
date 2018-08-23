import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Picture from './Picture';
import { drawPicture } from './shared';

class SaveButton extends React.Component {
  save = () => {
    const canvas = document.createElement('canvas');
    drawPicture(this.props.picture, canvas, 1);
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'pixel-art.png';
    link.click();
    link.remove();
  };

  render() {
    return <button onClick={this.save}>💾 Save</button>;
  }
}

SaveButton.propTypes = {
  picture: PropTypes.instanceOf(Picture).isRequired // Redux
}

function mapStateToProps(state) {
  return { picture: state.picture };
}

export default connect(mapStateToProps)(SaveButton);
