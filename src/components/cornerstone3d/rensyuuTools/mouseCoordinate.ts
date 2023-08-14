import { Types } from '@cornerstonejs/core';

export const mouseCoordinate = (
  content: HTMLElement,
  element: HTMLElement,
  viewport: Types.IStackViewport,
) => {
  // マウスの座標を取得するためのHTML要素を作成　ここから
  const mousePosDiv = document.createElement('div');
  const canvasPosElement = document.createElement('p');
  const worldPosElement = document.createElement('p');
  canvasPosElement.innerText = 'canvas:';
  worldPosElement.innerText = 'world:';
  content?.appendChild(mousePosDiv);

  mousePosDiv.appendChild(canvasPosElement);
  mousePosDiv.appendChild(worldPosElement);
  // Get the viewport element
  element.addEventListener('mousemove', (evt) => {
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
  canvasPosElement.className = 'text-xl text-purple-800';
  worldPosElement.className = 'text-xl text-purple-800 mb-10';
  // マウスの座標を取得するためのHTML要素を作成　ここまで
  const instructions = document.createElement('p');
  instructions.innerText =
    '中クリック:移動\n右クリック：拡大縮小\nマウスホイール：スタックスクロール';

  content.append(instructions);
};
