import * as cornerstoneTools from '@cornerstonejs/tools';

import { segmentationBrushAndScissors } from '@/components/cornerstone3d/rensyuuTools/tools/segmentationBrushAndScissors';

const { SegmentationDisplayTool } = cornerstoneTools;
/**
 * デモセグメンテーションの各軸スライスに2つの同心円を追加する。
 */

export const getSegmentToolGroupSetting = async (
  idName: string,
  toolbar: HTMLElement,
  element: HTMLElement,
  volumeId: string,
  toolGroupId: string,
  renderingEngineId: string,
  viewportId: string,
): Promise<void | undefined> => {
  // addTool

  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return;

  // segmentation
  cornerstoneTools.removeTool(SegmentationDisplayTool);
  cornerstoneTools.removeTool(cornerstoneTools.RectangleScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.CircleScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.SphereScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.PaintFillTool);
  cornerstoneTools.removeTool(cornerstoneTools.BrushTool);

  cornerstoneTools.addTool(SegmentationDisplayTool);
  cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.CircleScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.SphereScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.PaintFillTool);
  cornerstoneTools.addTool(cornerstoneTools.BrushTool);

  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  // segmentation rendering mockEllipsoidSegmentation
  // segmentationRenderingEllipsoid(volumeId, toolGroupId, idName);

  // segmentation swap
  // segmentationSwap(volumeId, toolGroupId, idName, toolbar);

  // segmentation brush and scissors
  await segmentationBrushAndScissors(volumeId, toolGroupId, idName, toolbar);

  //Global Labelmap Segmentation Configuration
  // await setGlobalLabelmapSegmentationConfiguration(
  //   volumeId,
  //   toolGroupId,
  //   idName,
  //   toolbar,
  //   renderingEngineId,
  //   viewportId,
  // );

  // setLabelmapSegmentSpecificConfiguration({
  //   idName,
  //   renderingEngineId,
  //   toolbar,
  //   toolGroupId,
  //   viewportId,
  //   volumeId,
  // });

  //ここまで
  console.log('toolGroup', toolGroup);

  // return toolGroup;
};
