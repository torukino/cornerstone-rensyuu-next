import * as cornerstoneTools from '@cornerstonejs/tools';

import { buttonTools } from '@/components/cornerstone3d/rensyuuTools/tools/buttonTools';
import { segmentationRenderingEllipsoid } from '@/components/cornerstone3d/rensyuuTools/tools/segmentationRenderingEllipsoid';
import { segmentationSwap } from '@/components/cornerstone3d/rensyuuTools/tools/segmentationSwap';

const { SegmentationDisplayTool } = cornerstoneTools;

/**
 * デモセグメンテーションの各軸スライスに2つの同心円を追加する。
 */

export const getToolGroupSetting = async (
  idName: string,
  toolbar: HTMLElement,
  element: HTMLElement,
  volumeId: string,
  toolGroupId: string,
): Promise<void | undefined> => {
  // addTool
  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return;
  // button oo tools
  buttonTools(toolGroupId);

  // segmentation
  cornerstoneTools.removeTool(SegmentationDisplayTool);
  cornerstoneTools.addTool(SegmentationDisplayTool);
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
  // segmentation rendering mockEllipsoidSegmentation
  segmentationRenderingEllipsoid(volumeId, toolGroupId, idName);
  // segmentation swap
  segmentationSwap(volumeId, toolGroupId, idName, toolbar);

  //ここまで
  console.log('toolGroup', toolGroup);

  // return toolGroup;
};
