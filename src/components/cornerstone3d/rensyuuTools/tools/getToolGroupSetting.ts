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
): Promise<void | undefined> => {
  // addTool

  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return;

  // segmentation
  cornerstoneTools.removeTool(SegmentationDisplayTool);
  cornerstoneTools.addTool(SegmentationDisplayTool);

  cornerstoneTools.removeTool(cornerstoneTools.RectangleScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.CircleScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.SphereScissorsTool);
  cornerstoneTools.removeTool(cornerstoneTools.PaintFillTool);

  cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.CircleScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.SphereScissorsTool);
  cornerstoneTools.addTool(cornerstoneTools.PaintFillTool);

  toolGroup.addTool(SegmentationDisplayTool.toolName);

  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  // segmentation rendering mockEllipsoidSegmentation
  // segmentationRenderingEllipsoid(volumeId, toolGroupId, idName);
  // segmentation swap
  // segmentationSwap(volumeId, toolGroupId, idName, toolbar);
  // segmentation brush and scissors
  segmentationBrushAndScissors(
    volumeId,
    toolGroupId,
    idName,
    toolbar,
    toolGroup,
  );

  //ここまで
  console.log('toolGroup', toolGroup);

  // return toolGroup;
};
