import Picture from './Picture';
import { elt, drawPicture } from './shared';

export class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt('select',
      { onchange: () => dispatch({ tool: this.select.value }) },
      ...Object.keys(tools).map(name =>
        elt('option', { selected: name === state.tool }, name)
      )
    );
    this.dom = elt('label', null, '🖌 Tool: ', this.select);
  }

  syncState(state) {
    this.select.value = state.tool;
  }
}

export class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt('input', {
      type: 'color',
      value: state.color,
      onchange: () => dispatch({ color: this.input.value })
    });
    this.dom = elt('label', null, '🎨 Color: ', this.input);
  }

  syncState(state) {
    this.input.value = state.color;
  }
}

export class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt('button', {
      onclick: () => this.save()
    }, '💾 Save');
  }

  save() {
    const canvas = elt('canvas');
    drawPicture(this.picture, canvas, 1);
    const link = elt('a', {
      href: canvas.toDataURL(),
      download: 'pixelart.png'
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  syncState(state) {
    this.picture = state.picture;
  }
}

export class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt('button', {
      onclick: () => startLoad(dispatch)
    }, '📁 Load');
  }

  syncState() {}
}

function startLoad(dispatch) {
  const input = elt('input', {
    type: 'file',
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const image = elt('img', {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  const width = Math.min(100, image.width);
  const height = Math.min(100, image.height);
  const canvas = elt('canvas', { width, height });
  const cx = canvas.getContext('2d');
  cx.drawImage(image, 0, 0);
  const pixels = [];
  const { data } = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, '0');
  }
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = data.slice(i, i + 3);
    pixels.push('#' + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

export class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt('button', {
      onclick: () => dispatch({ undo: true }),
      disabled: state.done.length === 0
    }, '⮪ Undo');
  }

  syncState(state) {
    this.dom.disabled = state.done.length === 0;
  }
}
