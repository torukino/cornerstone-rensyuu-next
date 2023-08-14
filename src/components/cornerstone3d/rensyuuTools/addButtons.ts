import { getRenderingEngine, Types } from '@cornerstonejs/core';
import {
  AngleTool,
  ArrowAnnotateTool,
  BidirectionalTool,
  CircleROITool,
  CobbAngleTool,
  EllipticalROITool,
  LengthTool,
  PlanarFreehandROITool,
  ProbeTool,
  RectangleROITool,
  ToolGroupManager,
} from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

import {
  addButtonToToolbar,
  addDropdownToToolbar,
} from '@/tools/cornerstoneTools';

const BUG = false;

export const addButtons = (
  idName: string,
  imageIds: string[],
  renderingEngineId: string,
  viewportId: string,
) => {
  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;

  container.className =
    'flex justify-center w-1/2 mb-4 border border-solid border-gray-400 border-2';

  const toolsNames = [
    PlanarFreehandROITool.toolName,
    LengthTool.toolName,
    ProbeTool.toolName,
    RectangleROITool.toolName,
    EllipticalROITool.toolName,
    CircleROITool.toolName,
    BidirectionalTool.toolName,
    AngleTool.toolName,
    CobbAngleTool.toolName,
    ArrowAnnotateTool.toolName,
  ];
  let selectedToolName = toolsNames[0];

  // Cornerstone3Dにツールを追加する
  // if (!ToolGroupManager.getToolGroup(toolGroupId)) {
  cornerstoneTools.addTool(PlanarFreehandROITool);
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(ProbeTool);
  cornerstoneTools.addTool(RectangleROITool);
  cornerstoneTools.addTool(EllipticalROITool);
  cornerstoneTools.addTool(CircleROITool);
  cornerstoneTools.addTool(BidirectionalTool);
  cornerstoneTools.addTool(AngleTool);
  cornerstoneTools.addTool(CobbAngleTool);
  cornerstoneTools.addTool(ArrowAnnotateTool);
  // }

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroupId = 'MRI_TOOL_GROUP';
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return;

  // Add the tools to the tool group
  toolGroup.addTool(PlanarFreehandROITool.toolName);
  toolGroup.addTool(LengthTool.toolName);
  toolGroup.addTool(ProbeTool.toolName);
  toolGroup.addTool(RectangleROITool.toolName);
  toolGroup.addTool(EllipticalROITool.toolName);
  toolGroup.addTool(CircleROITool.toolName);
  toolGroup.addTool(BidirectionalTool.toolName);
  toolGroup.addTool(AngleTool.toolName);
  toolGroup.addTool(CobbAngleTool.toolName);
  toolGroup.addTool(ArrowAnnotateTool.toolName);

  // ツールの初期状態を設定する。ここでは、左クリック時にアクティブになるツールを1つ設定する。
  // これは左クリックでそのツールが描画されることを意味する。
  toolGroup.setToolActive(PlanarFreehandROITool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });

  addDropdownToToolbar({
    container,
    idName,
    onSelectedValueChange: (newSelectedToolNameAsStringOrNumber) => {
      const newSelectedToolName = String(newSelectedToolNameAsStringOrNumber);

      //新しいツールをアクティブにする
      toolGroup.setToolActive(newSelectedToolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Primary, // Left Click
          },
        ],
      });

      // Set the old tool passive
      // toolGroup?.setToolPassive(selectedToolName);

      selectedToolName = newSelectedToolName as string;
    },
    options: { defaultValue: selectedToolName, values: toolsNames },
  });

  addButtonToToolbar({
    title: 'リセット',
    container,
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = renderingEngine?.getViewport(
        viewportId,
      ) as Types.IStackViewport;

      // Resets the viewport's camera
      viewport.resetCamera();
      // Resets the viewport's properties
      viewport.resetProperties();
      viewport.render();
    },
  });

  addButtonToToolbar({
    title: '白黒反転',
    container,
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = renderingEngine?.getViewport(
        viewportId,
      ) as Types.IStackViewport;

      const { invert } = viewport.getProperties();

      viewport.setProperties({ invert: !invert });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: '前',
    container,
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = renderingEngine?.getViewport(
        viewportId,
      ) as Types.IStackViewport;

      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();

      // Increment the index, clamping to the first image if necessary
      let newImageIdIndex = currentImageIdIndex - 1;

      newImageIdIndex = Math.max(newImageIdIndex, 0);
      if (BUG) {
        console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
        const NoOfImgs = imageIds[newImageIdIndex].split('/')[18].split('.');
        console.log(NoOfImgs[NoOfImgs.length - 1]);
        console.log(
          JSON.stringify(imageIds[newImageIdIndex].split('/'), null, 2),
        );
      }

      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });
  addButtonToToolbar({
    title: '次',
    container,
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = renderingEngine?.getViewport(
        viewportId,
      ) as Types.IStackViewport;

      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();

      // Increment the index, clamping to the first image if necessary
      let newImageIdIndex = currentImageIdIndex + 1;

      newImageIdIndex = Math.min(newImageIdIndex, imageIds.length - 1);
      if (BUG) {
        console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
        const NoOfImgs = imageIds[newImageIdIndex].split('/')[18].split('.');
        console.log(NoOfImgs[NoOfImgs.length - 1]);
        console.log(
          JSON.stringify(imageIds[newImageIdIndex].split('/'), null, 2),
        );
      }

      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });
};
