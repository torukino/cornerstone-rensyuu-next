import { ImageVolume, Types, volumeLoader } from '@cornerstonejs/core';
import { segmentation } from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

import { addButtonToToolbar } from '@/tools/cornerstoneTools';

export const segmentationSwap = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
) => {
  //-----------segmentation swap ----------
  const segmentationId1 = 'segmentation_id1' + Date.now();
  const segmentationId2 = 'segmentation_id2' + Date.now();

  // Add some segmentations based on the source data volume
  await addSegmentationsToState(volumeId, segmentationId1, segmentationId2);

  // // Add the first segmentation representation to the toolgroup
  const [segmentationRepresentationUID] =
    await segmentation.addSegmentationRepresentations(toolGroupId, [
      {
        segmentationId: segmentationId1,
        type: SegmentationRepresentations.Labelmap,
      },
    ]);
  let segmentationDisplayed: string = segmentationId1;
  let activeSegmentationRepresentationUID: string;

  activeSegmentationRepresentationUID = segmentationRepresentationUID;

  addButtonToToolbar({
    title: 'Swap Segmentation',
    idName,
    onClick: async () => {
      // Remove the currently displayed segmentation representation
      segmentation.removeSegmentationsFromToolGroup(toolGroupId, [
        activeSegmentationRepresentationUID,
      ]);

      if (segmentationDisplayed === segmentationId1) {
        // Add segmentation 2
        const [segmentationRepresentationUID] =
          await segmentation.addSegmentationRepresentations(toolGroupId, [
            {
              segmentationId: segmentationId2,
              type: SegmentationRepresentations.Labelmap,
            },
          ]);

        activeSegmentationRepresentationUID = segmentationRepresentationUID;
        segmentationDisplayed = segmentationId2;
      } else {
        // Add segmentation 1
        const [segmentationRepresentationUID] =
          await segmentation.addSegmentationRepresentations(toolGroupId, [
            {
              segmentationId: segmentationId1,
              type: SegmentationRepresentations.Labelmap,
            },
          ]);

        activeSegmentationRepresentationUID = segmentationRepresentationUID;
        segmentationDisplayed = segmentationId1;
      }
    },
    toolbar,
  });
};

async function addSegmentationsToState(
  volumeId: string,
  segmentationId1: string,
  segmentationId2: string,
) {
  // Create a segmentation of the same resolution as the source data
  // using volumeLoader.createAndCacheDerivedVolume.
  const segmentationVolume1 = await volumeLoader.createAndCacheDerivedVolume(
    volumeId,
    {
      volumeId: segmentationId1,
    },
  );
  const segmentationVolume2 = await volumeLoader.createAndCacheDerivedVolume(
    volumeId,
    {
      volumeId: segmentationId2,
    },
  );

  // Add the segmentations to state
  segmentation.addSegmentations([
    {
      representation: {
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId1,
        },
        // The type of segmentation
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId: segmentationId1,
    },
    {
      representation: {
        data: {
          volumeId: segmentationId2,
        },
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId: segmentationId2,
    },
  ]);

  // Add some data to the segmentations
  fillSegmentationWithCircles(segmentationVolume1, [50, 50]);
  fillSegmentationWithCircles(segmentationVolume2, [-50, -50]);
}

function fillSegmentationWithCircles(
  segmentationVolume: ImageVolume,
  centerOffset: Types.Point2,
) {
  const scalarData = segmentationVolume.getScalarData();

  let voxelIndex = 0;

  const { dimensions } = segmentationVolume;

  const innerRadius = dimensions[0] / 8;
  const outerRadius = dimensions[0] / 4;

  const center = [
    dimensions[0] / 2 + centerOffset[0],
    dimensions[1] / 2 + centerOffset[1],
  ];

  for (let z = 0; z < dimensions[2]; z++) {
    for (let y = 0; y < dimensions[1]; y++) {
      for (let x = 0; x < dimensions[0]; x++) {
        const distanceFromCenter = Math.sqrt(
          (x - center[0]) * (x - center[0]) + (y - center[1]) * (y - center[1]),
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
