import { ImageVolume, volumeLoader } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  MouseBindings,
  SegmentationRepresentations,
} from '@cornerstonejs/tools/dist/esm/enums';

const {
  BrushTool,
  PanTool,
  segmentation,
  SegmentationDisplayTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

/**
 * デモセグメンテーションの各軸スライスに2つの同心円を追加する。
 */
function createMockEllipsoidSegmentation(segmentationVolume: ImageVolume) {
  const scalarData = segmentationVolume.getScalarData();
  const { dimensions } = segmentationVolume;

  const center = [dimensions[0] / 2, dimensions[1] / 2, dimensions[2] / 2];
  const outerRadius = 50;
  const innerRadius = 10;

  let voxelIndex = 0;

  for (let z = 0; z < dimensions[2]; z++) {
    for (let y = 0; y < dimensions[1]; y++) {
      for (let x = 0; x < dimensions[0]; x++) {
        const distanceFromCenter = Math.sqrt(
          (x - center[0]) * (x - center[0]) +
            (y - center[1]) * (y - center[1]) +
            (z - center[2]) * (z - center[2]),
        );
        scalarData[voxelIndex] = 1;
        if (distanceFromCenter < innerRadius) {
          scalarData[voxelIndex] = 1;
        } else if (distanceFromCenter < outerRadius) {
          scalarData[voxelIndex] = 2;
        }

        voxelIndex++;
      }
    }
  }
}

export const getToolGroupSetting = async (
  element: HTMLElement,
  volumeId: string,
  segmentationId: string,
): Promise<cornerstoneTools.Types.IToolGroup | undefined> => {
  // addTool
  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  const toolGroupId = 'TOOL_GROUP_ID';
  if (cornerstoneTools) cornerstoneTools.destroy();
  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(WindowLevelTool);
  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(SegmentationDisplayTool);
  cornerstoneTools.addTool(BrushTool);

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup: cornerstoneTools.Types.IToolGroup | undefined =
    ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.addTool(BrushTool.toolName);

  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(BrushTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });

  // CTボリュームのソースデータと同じ解像度のセグメンテーションを作成する。
  const segmentationVolume = await volumeLoader.createAndCacheDerivedVolume(
    volumeId,
    {
      volumeId: segmentationId,
    },
  );

  //セグメンテーションをステートに追加する
  segmentation.addSegmentations([
    {
      representation: {
        // 実際のセグメンテーションデータ（labelmap の場合）。
        // セグメンテーションのソースボリュームへの参照。
        data: {
          volumeId: segmentationId,
        },
        // セグメンテーションの種類
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId,
    },
  ]);

  console.log('segmentationVolume1', segmentationVolume);

  // Add some data to the segmentations
  createMockEllipsoidSegmentation(segmentationVolume);

  console.log('segmentationVolume2', segmentationVolume);

  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);

  const activeR =
    segmentation.activeSegmentation.getActiveSegmentationRepresentation(
      toolGroupId,
    );
  console.log('activeR', activeR);
  // Set the active tool for the group
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  // toolGroup.setToolActive(PanTool.toolName, {
  //   bindings: [
  //     {
  //       mouseButton: MouseBindings.Primary, // Left Click
  //     },
  //   ],
  // });

  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // Middle Click
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
  console.log('toolGroup', toolGroup);

  return toolGroup;
};
