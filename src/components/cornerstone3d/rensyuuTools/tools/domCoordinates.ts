import { ImageVolume, Types, utilities as csUtils } from '@cornerstonejs/core';

const BUG = false;
export const domCoordinates = (
  coordinates: HTMLElement,
  element: HTMLElement,
  viewport: Types.IVolumeViewport | Types.IStackViewport,
  volume: Record<string, any>,
  volumeSegmentation: ImageVolume,
) => {
  console.log('@@@@ domCoordinates @@@@');
  console.log('@@@@ volume         @@@@', volume);
  // canvasとworld座標・MRI値表示のためのDOMを用意する
  const mousePosDiv = document.createElement('div');

  const canvasPosElement = document.createElement('p');
  const worldPosElement = document.createElement('p');
  const mriValueElement = document.createElement('p');
  const segmentationValueElement = document.createElement('p');

  // canvasPosElement.innerText = 'canvas:';
  // worldPosElement.innerText = 'world:';
  // mriValueElement.innerText = 'MRI value:';

  coordinates.appendChild(mousePosDiv);

  mousePosDiv.appendChild(canvasPosElement);
  mousePosDiv.appendChild(worldPosElement);
  mousePosDiv.appendChild(mriValueElement);
  mousePosDiv.appendChild(segmentationValueElement);

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
    segmentationValueElement.innerText = `segmentation value: ${getSegmentationValue(
      volumeSegmentation,
      worldPos,
    )}`;
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

function getSegmentationValue(
  volumeSegmentation: ImageVolume,
  worldPos: Types.Point3,
) {
  const scalarData = volumeSegmentation.getScalarData();
  const { imageData } = volumeSegmentation;
  const { dimensions } = volumeSegmentation;
  if (!imageData) return;
  const index = imageData.worldToIndex(worldPos);

  index[0] = Math.floor(index[0]);
  index[1] = Math.floor(index[1]);
  index[2] = Math.floor(index[2]);

  BUG && console.log('@@@@ index @@@@', index);
  BUG && console.log('@@@@ dimensions @@@@', dimensions);
  BUG && console.log('@@@@ scalarData @@@@', scalarData);

  if (
    !csUtils.indexWithinDimensions(
      [index[0], index[1], index[2]],
      [dimensions[0], dimensions[1], dimensions[2]],
    )
  ) {
    return;
  }

  const yMultiple = dimensions[0];
  const zMultiple = dimensions[0] * dimensions[1];

  const value =
    scalarData[index[2] * zMultiple + index[1] * yMultiple + index[0]];

  BUG && console.log('@@@@ value @@@@', value);
  return value;
}
