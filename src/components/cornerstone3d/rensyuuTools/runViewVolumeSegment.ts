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
  // ツールグループが存在するかどうかを確認します
  const hasToolGroup =
    cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  // ツールグループが存在する場合、それを破壊します
  if (hasToolGroup)
    cornerstoneTools.ToolGroupManager.destroyToolGroup(toolGroupId);
  // 新しいツールグループを作成します
  toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);
  // ツールグループが作成されなかった場合、関数を終了します
  if (!toolGroup) return;

  cornerstoneTools.removeTool(SegmentationDisplayTool);
  cornerstoneTools.addTool(SegmentationDisplayTool);
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  // Define a volume in memory for  MRI
  const volume: Record<string, any> = await volumeLoader.createAndCacheVolume(
    volumeId,
    {
      imageIds,
    },
  );
  const segmentationId = 'my_segmentation_id'+ Date.now();
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
