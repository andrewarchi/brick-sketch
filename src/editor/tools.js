export function draw(pos, picture, color, dispatch) {
  function drawPixel({ x, y }, picture, color) {
    const drawn = { x, y, color };
    dispatch({ picture: picture.draw([drawn]) });
  }
  drawPixel(pos, picture, color);
  return drawPixel;
}

export function rectangle(start, picture, color, dispatch) {
  function drawRectangle(pos) {
    const xStart = Math.min(start.x, pos.x);
    const yStart = Math.min(start.y, pos.y);
    const xEnd = Math.max(start.x, pos.x);
    const yEnd = Math.max(start.y, pos.y);
    const drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color });
      }
    }
    dispatch({ picture: picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 }
];

export function fill({ x, y }, picture, color, dispatch) {
  const targetColor = picture.pixel(x, y);
  const drawn = [{ x, y, color }];
  for (let done = 0; done < drawn.length; done++) {
    for (const { dx, dy } of around) {
      const x = drawn[done].x + dx;
      const y = drawn[done].y + dy;
      if (x >= 0 && x < picture.width &&
          y >= 0 && y < picture.height &&
          picture.pixel(x, y) === targetColor &&
          !drawn.some(p => p.x === x && p.y === y)) {
        drawn.push({ x, y, color });
      }
    }
  }
  dispatch({ picture: picture.draw(drawn) });
}

export function pick(pos, picture, color, dispatch) {
  dispatch({ color: picture.pixel(pos.x, pos.y) });
}
