import { Types } from '@cornerstonejs/core';
// マウスの座標を取得するためのHTML要素を作成

export const mouseCoordinate = (
  content: HTMLElement,
  element: HTMLElement,
  viewport: Types.IStackViewport,
) => {
  const mousePosDiv = document.createElement('div');
  const canvasPosElement = document.createElement('p');
  const worldPosElement = document.createElement('p');
  canvasPosElement.innerText = 'canvas:';
  worldPosElement.innerText = 'world:';
  mousePosDiv.appendChild(canvasPosElement);
  mousePosDiv.appendChild(worldPosElement);

  content.appendChild(mousePosDiv);

  // Get the viewport element
  // console.log('Adding event listener to: ', element);
  element.addEventListener('mousemove', (evt) => {
    // console.log(`mousemove: ${JSON.stringify(evt, null, 2)}`);
    // getBoundingClientRectの中身はなんですか？
    // https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect
    const rect = element.getBoundingClientRect();
    const canvasPos: Types.Point2 = [
      Math.floor(evt.clientX - rect.left),
      Math.floor(evt.clientY - rect.top),
    ];
    // Convert canvas coordinates to world coordinates
    const worldPos = viewport.canvasToWorld(canvasPos);

    canvasPosElement.innerText = `canvas座標: (${canvasPos[0]}, ${canvasPos[1]})`;
    worldPosElement.innerText = `world座標: (${worldPos[0].toFixed(
      2,
    )}, ${worldPos[1].toFixed(2)}, ${worldPos[2].toFixed(2)})`;
  });
  //
  //   let num = 10.56789;
  // let str = num.toFixed(2); // strには"10.57"という文字列が代入される

  // console.log('Event listener added!');

  canvasPosElement.className = 'text-xl text-purple-800';
  worldPosElement.className = 'text-xl text-purple-800 mb-10';
};
