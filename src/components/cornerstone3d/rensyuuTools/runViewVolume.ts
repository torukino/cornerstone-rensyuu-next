import {
  cache,
  Enums,
  RenderingEngine,
  Types,
  utilities as csUtils,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

import { setMriTransferFunctionForVolumeActor } from '@/tools/cornerstoneTools';

const { PanTool, StackScrollMouseWheelTool, ToolGroupManager, ZoomTool } =
  cornerstoneTools;
const { ViewportType } = Enums;
// let renderingEngine: RenderingEngine | null = null;
let volume: any;
export const runViewVolume = async (
  imageIds: string[],
  content: HTMLElement,
  element: HTMLDivElement,
  renderingEngineId: string,
  volumeId: string,
  viewportId: string,
): Promise<void> => {
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
  //ここまで

  // addTool
  const toolGroupId = 'TOOL_GROUP_ID';
  cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });

  //ここまで
  cache.purgeCache();

  const renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[1.0, 0, 0],
      orientation: Enums.OrientationAxis.ACQUISITION,
    },
    element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId,
  };

  renderingEngine.enableElement(viewportInput);
  // console.log(renderingEngine);

  // メモリー上でvolumeを定義する
  const volume: Record<string, any> = await volumeLoader.createAndCacheVolume(
    volumeId,
    {
      imageIds,
    },
  );

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

  // volumeの起動(load)のセット
  await volume.load();

  //ビューポートにvolumeをセットする
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );
  await viewport.setVolumes([
    {
      callback: setMriTransferFunctionForVolumeActor,
      volumeId,
    },
  ]);

  toolGroup.addViewport(viewportId, renderingEngineId);

  viewport.render();
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
