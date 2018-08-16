export const scale = 10;

export function updateState(state, action) {
  return { ...state, ...action };
}

export function elt(type, props, ...children) {
  const dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

export function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  const cx = canvas.getContext('2d');

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

export function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale)
  };
}
