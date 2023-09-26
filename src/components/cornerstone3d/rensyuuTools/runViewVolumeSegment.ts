import {
  cache,
  Enums,
  ImageVolume,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

const { ViewportType } = Enums;
const { SegmentationDisplayTool } = cornerstoneTools;

let toolGroup: cornerstoneTools.Types.IToolGroup | undefined;

export const runViewVolumeSegment = async (
  idName: string,
  imageIds: string[],
  coordinates: HTMLElement,
  element: HTMLDivElement,
  volumeId: string,
  viewportId: string,
  isVolume: boolean,
): Promise<void | undefined> => {
  // if (cornerstoneTools) cornerstoneTools.destroy();
  cache.purgeCache();

  const toolGroupId = 'tool_group_id';

  cornerstoneTools.addTool(SegmentationDisplayTool);
  toolGroup = await cornerstoneTools.ToolGroupManager.createToolGroup(
    toolGroupId,
  );
  if (!toolGroup) return;

  const segmentationDisplayTool: cornerstoneTools.Types.IToolGroup[] | [] =
    cornerstoneTools.ToolGroupManager.getToolGroupsWithToolName(
      SegmentationDisplayTool.toolName,
    );
  console.log('segmentationDisplayTool1', segmentationDisplayTool);
  if (segmentationDisplayTool?.length === 0) {
    toolGroup.addTool(SegmentationDisplayTool.toolName);
    toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
  }
  console.log('segmentationDisplayTool2', segmentationDisplayTool);

  // Define a volume in memory for  MRI
  const volume: Record<string, any> = await volumeLoader.createAndCacheVolume(
    volumeId,
    {
      imageIds,
    },
  );
  const segmentationId = 'my_segmentation_id';
  // Create a segmentation of the same resolution as the source data for the CT volume
  const segmentationVolume: ImageVolume =
    await volumeLoader.createAndCacheDerivedVolume(volumeId, {
      volumeId: segmentationId,
    });

  // Add some data to the segmentations
  createMockEllipsoidSegmentation(segmentationVolume);

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

  // // Add the segmentation representation to the toolGroup
  await cornerstoneTools.segmentation.addSegmentationRepresentations(
    toolGroupId,
    [
      {
        segmentationId,
        type: SegmentationRepresentations.Labelmap,
      },
    ],
  );

  // Instantiate a rendering engine
  const renderingEngineId = 'myRenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);

  const viewportInput = {
    defaultOptions: {
      orientation: Enums.OrientationAxis.ACQUISITION,
    },
    element: element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId: viewportId,
  };

  renderingEngine.enableElement(viewportInput);

  toolGroup.addViewport(viewportId, renderingEngineId);

  volume.load();

  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);

  // Render the image
  renderingEngine.renderViewports([viewportId]);
};

function createMockEllipsoidSegmentation(segmentationVolume: any) {
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
