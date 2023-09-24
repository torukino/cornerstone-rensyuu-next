import { ImageVolume, volumeLoader } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  MouseBindings,
  SegmentationRepresentations,
} from '@cornerstonejs/tools/dist/esm/enums';

const {
  PanTool,
  SegmentationDisplayTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

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

  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
  // // Add the segmentation representation to the toolgroup
  // Add some segmentations based on the source data volume

  await addSegmentationsToState(volumeId, segmentationId);

  await cornerstoneTools.segmentation.addSegmentationRepresentations(
    toolGroupId,
    [
      {
        segmentationId,
        type: SegmentationRepresentations.Labelmap,
      },
    ],
  );

  // Set the active tool for the group
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });

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

/**
 * Adds two concentric circles to each axial slice of the demo segmentation.
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

async function addSegmentationsToState(
  volumeId: string,
  segmentationId: string,
) {
  // Create a segmentation of the same resolution as the source data
  // using volumeLoader.createAndCacheDerivedVolume.
  const segmentationVolume: ImageVolume =
    await volumeLoader.createAndCacheDerivedVolume(volumeId, {
      volumeId: segmentationId,
    });

  // Add the segmentations to state
  cornerstoneTools.segmentation.addSegmentations([
    {
      representation: {
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId,
        },
        // The type of segmentation
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId,
    },
  ]);

  // Add some data to the segmentations
  createMockEllipsoidSegmentation(segmentationVolume);
}
