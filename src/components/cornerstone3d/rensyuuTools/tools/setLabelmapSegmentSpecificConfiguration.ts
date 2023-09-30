import { volumeLoader } from '@cornerstonejs/core';
import { segmentation } from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

import { addSliderToToolbar } from '@/tools/cornerstoneTools';

const BUG = true;
export const setLabelmapSegmentSpecificConfiguration = async ({
  idName,
  renderingEngineId,
  toolbar,
  toolGroupId,
  viewportId,
  volumeId,
}: {
  idName: string;
  renderingEngineId: string;
  toolbar: HTMLElement;
  toolGroupId: string;
  viewportId: string;
  volumeId: string;
}) => {
  // Add some segmentations based on the source data volume
  // Add some segmentations based on the source data volume
  const segmentationId1 = 'segmentationId1' + Date.now();
  const segmentationId2 = 'segmentationId2' + Date.now();

  await addSegmentationsToState(volumeId, segmentationId1, segmentationId2);

  // // Add the segmentation representations to the toolgroup
  const [segmentationRepresentationUID] =
    await segmentation.addSegmentationRepresentations(toolGroupId, [
      {
        segmentationId: segmentationId1,
        type: SegmentationRepresentations.Labelmap,
      },
    ]);

  let segment1FillAlpha = 0.9;
  let segment2FillAlpha = 0.9;

  addSliderToToolbar({
    title: 'fill alpha for Segment 1',
    defaultValue: 90,
    idName,
    onSelectedValueChange: (value) => {
      segment1FillAlpha = Number(value) / 100;

      const config1 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config1 @@@', config1);

      segmentation.config.setSegmentSpecificConfig(
        toolGroupId,
        segmentationRepresentationUID,
        {
          1: {
            LABELMAP: {
              fillAlpha: segment1FillAlpha,
            },
          },
        },
      );

      const config2 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config2 @@@', config2);
    },
    range: [0, 100],
    toolbar,
  });

  addSliderToToolbar({
    title: 'fill alpha for Segment 2',
    defaultValue: 90,
    idName,
    onSelectedValueChange: (value) => {
      segment2FillAlpha = Number(value) / 100;

      segmentation.config.setSegmentSpecificConfig(
        toolGroupId,
        segmentationRepresentationUID,
        {
          2: {
            LABELMAP: {
              fillAlpha: segment2FillAlpha,
            },
          },
        },
      );
    },
    range: [0, 100],
    toolbar,
  });
};

function fillSegmentationWithCircles(
  segmentationVolume: any,
  centerOffset: any,
) {
  const scalarData = segmentationVolume.scalarData;

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
  ]);

  // Add some data to the segmentations
  fillSegmentationWithCircles(segmentationVolume1, [50, 50]);
}
