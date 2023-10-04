import { segmentation } from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  MouseBindings,
  SegmentationRepresentations,
} from '@cornerstonejs/tools/dist/esm/enums';

export const segmentationTutorialBrush = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
  segmentationId: string,
) => {
  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  // ツールグループが作成されなかった場合、関数を終了します
  if (!toolGroup) return;
  //   segmentation.removeSegmentationsFromToolGroup(toolGroupId);


  toolGroup.setToolActive(cornerstoneTools.BrushTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });

  // Add the segmentations to state
  segmentation.addSegmentations([
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
  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);
};
