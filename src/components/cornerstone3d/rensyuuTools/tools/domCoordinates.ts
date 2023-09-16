import { Types, utilities as csUtils } from '@cornerstonejs/core';

export const domCoordinates = (
  content: HTMLElement,
  element: HTMLElement,
  viewport: Types.IVolumeViewport|Types.IStackViewport,
  volume: Record<string, any>,
) => {
  // canvasとworld座標・MRI値表示のためのDOMを用意する
  const mousePosDiv = document.createElement('div');

  const canvasPosElement = document.createElement('p');
  const worldPosElement = document.createElement('p');
  const mriValueElement = document.createElement('p');

  canvasPosElement.innerText = 'canvas:';
  worldPosElement.innerText = 'world:';
  mriValueElement.innerText = 'MRI value:';

  content.appendChild(mousePosDiv);

  mousePosDiv.appendChild(canvasPosElement);
  mousePosDiv.appendChild(worldPosElement);
  mousePosDiv.appendChild(mriValueElement);

  element.addEventListener('mousemove', (evt) => {
    const rect = element.getBoundingClientRect();

    const canvasPos = <Types.Point2>[
      Math.floor(evt.clientX - rect.left),
      Math.floor(evt.clientY - rect.top),
    ];
    // Convert canvas coordiantes to world coordinates
    const worldPos: Types.Point3 = viewport.canvasToWorld(canvasPos);

    canvasPosElement.innerText = `canvas: (${canvasPos[0]}, ${canvasPos[1]})`;
    worldPosElement.innerText = `world: (${worldPos[0].toFixed(
      2,
    )}, ${worldPos[1].toFixed(2)}, ${worldPos[2].toFixed(2)})`;
    mriValueElement.innerText = `MRI value: ${getMriValue(volume, worldPos)}`;
  });
};

function getMriValue(volume: Record<string, any>, worldPos: Types.Point3) {
  const { dimensions, imageData, scalarData } = volume;

  const index = imageData.worldToIndex(worldPos);

  index[0] = Math.floor(index[0]);
  index[1] = Math.floor(index[1]);
  index[2] = Math.floor(index[2]);

  if (!csUtils.indexWithinDimensions(index, dimensions)) {
    return;
  }

  const yMultiple = dimensions[0];
  const zMultiple = dimensions[0] * dimensions[1];

  const value =
    scalarData[index[2] * zMultiple + index[1] * yMultiple + index[0]];

  return value;
}
