import { ImageVolume, Types, utilities as csUtils } from '@cornerstonejs/core';

import { addButtonToToolbar } from '@/tools/cornerstoneTools';

const BUG = false;
export const domCoordinates = async (
  coordinates: HTMLElement,
  element: HTMLElement,
  viewport: Types.IVolumeViewport | Types.IStackViewport,
  volumeId: string,
  volume: Record<string, any>,
  volumeSegmentation: ImageVolume,
  toolbar: HTMLElement,
  idName: string,
) => {
  // console.log('@@@@ domCoordinates @@@@');
  // console.log('@@@@ volume         @@@@', volume);
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

    const { dimensions, imageData, scalarData } = volume;

    mriValueElement.innerText = `MRI value: ${getMriValue(
      canvasPos,
      viewport as Types.IVolumeViewport,
      scalarData,
      imageData,
      dimensions,
    )}`;

    const scalarDataSegmentation = volumeSegmentation.getScalarData();
    const imageDataSegmentation = volumeSegmentation.imageData;
    const dimensionsSegmentation = volumeSegmentation.dimensions;
    segmentationValueElement.innerText = `segmentation value: ${getSegmentationValue(
      canvasPos,
      viewport as Types.IVolumeViewport,
      scalarDataSegmentation,
      imageDataSegmentation,
      dimensionsSegmentation,
    )}`;
  });

  addButtonToToolbar({
    title: 'ピクセルデータ',
    idName,
    onClick: async () => {
      const eWidth: number = element.offsetWidth;
      const eHeight: number = element.offsetHeight;
      const { dimensions, imageData, scalarData } = volume;
      const pixelData = [];
      const pixelDataSegmentation = [];
      let value: number | undefined = undefined;
      let valueSegmentation: number | undefined = undefined;

      const scalarDataSegmentation = volumeSegmentation.getScalarData();

      const imageDataSegmentation = volumeSegmentation.imageData;
      const dimensionsSegmentation = volumeSegmentation.dimensions;
      for (let h = 0; h < eHeight; h++) {
        const widthData = [];
        const widthDataSegmentation = [];
        for (let w = 0; w < eWidth; w++) {
          value = getMriValue(
            [w, h] as Types.Point2,
            viewport as Types.IVolumeViewport,
            scalarData,
            imageData,
            dimensions,
          ) as number;
          widthData.push(value);

          valueSegmentation = getSegmentationValue(
            [w, h] as Types.Point2,
            viewport as Types.IVolumeViewport,
            scalarDataSegmentation,
            imageDataSegmentation,
            dimensionsSegmentation,
          ) as number;

          // console.log('@@@@ valueSegmentation @@@@', valueSegmentation);

          widthDataSegmentation.push(valueSegmentation);
        }
        pixelData.push(widthData);
        pixelDataSegmentation.push(widthDataSegmentation);
      }

      drawingPixel(pixelData, eWidth, eHeight);
      // console.log('@@@@ pixelDataSegmentation @@@@', pixelDataSegmentation);
      drawingPixelSegmentation(pixelDataSegmentation, eWidth, eHeight);
    },
    toolbar,
  });
};

function getMriValue(
  canvasPos: Types.Point2,
  viewport: Types.IVolumeViewport,
  scalarData: Types.VolumeScalarData,
  imageData: any,
  dimensions: Types.Point3,
) {
  // Convert canvas coordiantes to world coordinates

  const worldPos: Types.Point3 = viewport.canvasToWorld(canvasPos);

  const index = imageData.worldToIndex(worldPos);

  index[0] = Math.floor(index[0]);
  index[1] = Math.floor(index[1]);
  index[2] = Math.floor(index[2]);

  if (!csUtils.indexWithinDimensions(index, dimensions)) return 0;

  const yMultiple = dimensions[0];
  const zMultiple = dimensions[0] * dimensions[1];
  // console.log(' canvasPos', canvasPos);
  // console.log(`dimensions: ${dimensions} index: ${index}`);
  // console.log(
  //   `yMultiple: ${yMultiple} zMultiple: ${zMultiple} scalarData: ${scalarData}`,
  // );
  const value =
    scalarData[index[2] * zMultiple + index[1] * yMultiple + index[0]];
  // console.log(`@@@@ value [${canvasPos}] = ${value} @@@`);
  return value;
}

function getSegmentationValue(
  canvasPos: Types.Point2,
  viewport: Types.IVolumeViewport,
  scalarData: Types.VolumeScalarData,
  imageData: any,
  dimensions: Types.Point3,
) {

  console.log('@@@@ getSegmentationValue @@@@');
  // let max = Math.max(...scalarData); // 最大値
  // let min = Math.min(...scalarData); // 最小値

  // console.log(
  //   `@@@@ scalarData  max${max} min${min} ${scalarData.length} dementions ${dimensions} @@@@`,
  // );
  // console.log('@@@@ imageData @@@@', imageData);
  // Convert canvas coordiantes to world coordinates

  const worldPos: Types.Point3 = viewport.canvasToWorld(canvasPos);

  if (!imageData) return;
  const index = imageData.worldToIndex(worldPos);

  index[0] = Math.floor(index[0]);
  index[1] = Math.floor(index[1]);
  index[2] = Math.floor(index[2]);

  // BUG && console.log('@@@@ index @@@@', index);
  // BUG && console.log('@@@@ dimensions @@@@', dimensions);
  // BUG && console.log('@@@@ scalarData @@@@', scalarData);

  if (
    !csUtils.indexWithinDimensions(
      [index[0], index[1], index[2]],
      [dimensions[0], dimensions[1], dimensions[2]],
    )
  ) {
    return 0;
  }

  const yMultiple = dimensions[0];
  const zMultiple = dimensions[0] * dimensions[1];

  const value =
    scalarData[index[2] * zMultiple + index[1] * yMultiple + index[0]];
  // console.log(`@@@@ segmentation value [${canvasPos}] = ${value} @@@`);
  return value;
}

const drawingPixel = (
  pixelData: number[][],
  eWidth: number,
  eHeight: number,
) => {
  // pixelDataの最大値と最小値を見つける
  let minVal = Infinity;
  let maxVal = -Infinity;

  for (let i = 0; i < pixelData.length; i++) {
    for (let j = 0; j < pixelData[i].length; j++) {
      minVal = Math.min(minVal, pixelData[i][j]);
      maxVal = Math.max(maxVal, pixelData[i][j]);
    }
  }

  // pixelDataを正規化してdataに格納する
  const data = [];

  for (let i = 0; i < pixelData.length; i++) {
    const row = [];
    for (let j = 0; j < pixelData[i].length; j++) {
      // 正規化: (値 - 最小値) / (最大値 - 最小値) * 255
      const normalized = ((pixelData[i][j] - minVal) / (maxVal - minVal)) * 255;
      row.push(normalized);
    }
    data.push(row);
  }

  // Canvas要素を作成
  const canvas = document.createElement('canvas');
  canvas.width = eWidth;
  canvas.height = eHeight;

  const text = document.createElement('p');
  text.innerText = 'ピクセルデータからのMRI画像';

  // 2D描画コンテクストを取得
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // 二次元配列をループして、各ピクセルの色を設定
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const value = data[y][x];
      ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Canvasの内容を画像として出力
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');

  // 画像をページに追加
  const drawingMRI = document.getElementById(`drawingMRI`);
  if (!drawingMRI) return;
  while (drawingMRI.firstChild) {
    drawingMRI.removeChild(drawingMRI.firstChild);
  }
  if (!drawingMRI.hasChildNodes()) {
    drawingMRI.appendChild(text);
    drawingMRI.appendChild(img);
  }
};

const drawingPixelSegmentation = (
  pixelData: number[][],
  eWidth: number,
  eHeight: number,
) => {
  // pixelDataの最大値と最小値を見つける
  let minVal = Infinity;
  let maxVal = -Infinity;

  for (let i = 0; i < pixelData.length; i++) {
    for (let j = 0; j < pixelData[i].length; j++) {
      minVal = Math.min(minVal, pixelData[i][j]);
      maxVal = Math.max(maxVal, pixelData[i][j]);
    }
  }

  // pixelDataを正規化してdataに格納する
  const data = [];

  for (let i = 0; i < pixelData.length; i++) {
    const row = [];
    for (let j = 0; j < pixelData[i].length; j++) {
      // 正規化: (値 - 最小値) / (最大値 - 最小値) * 255
      const normalized = ((pixelData[i][j] - minVal) / (maxVal - minVal)) * 255;
      row.push(normalized);
    }
    data.push(row);
  }

  // Canvas要素を作成
  const canvas = document.createElement('canvas');
  canvas.width = eWidth;
  canvas.height = eHeight;

  const text = document.createElement('p');
  text.innerText = 'ピクセルデータからのセグメンテーション画像';

  // 2D描画コンテクストを取得
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // 二次元配列をループして、各ピクセルの色を設定
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const value = data[y][x];
      ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Canvasの内容を画像として出力
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');

  // 画像をページに追加
  const drawingLabel = document.getElementById(`drawingLabel`);
  if (!drawingLabel) return;
  while (drawingLabel.firstChild) {
    drawingLabel.removeChild(drawingLabel.firstChild);
  }
  if (!drawingLabel.hasChildNodes()) {
    drawingLabel.appendChild(text);
    drawingLabel.appendChild(img);
  }
};
