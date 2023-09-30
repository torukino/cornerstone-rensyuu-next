import { getRenderingEngine, volumeLoader } from '@cornerstonejs/core';
import { segmentation } from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

import {
  addSliderToToolbar,
  addToggleButtonToToolbar,
} from '@/tools/cornerstoneTools';

export const setGlobalLabelmapSegmentationConfiguration = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
  renderingEngineId: string,
  viewportId: string,
) => {
  // ============================= //

  addToggleButtonToToolbar({
    title: 'toggle render inactive segmentations',
    defaultToggle: true,

    onClick: (toggle) => {
      const config = segmentation.config.getGlobalConfig();

      config.renderInactiveSegmentations = toggle;
      segmentation.config.setGlobalConfig(config);

      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) return;
      renderingEngine.renderViewports([viewportId]);
    },
  });

  addToggleButtonToToolbar({
    title: 'toggle outline rendering',
    defaultToggle: true,
    onClick: (toggle) => {
      setConfigValue('renderOutline', toggle, renderingEngineId, viewportId);
    },
  });
  addToggleButtonToToolbar({
    title: 'toggle fill rendering',
    defaultToggle: true,
    onClick: (toggle) => {
      setConfigValue('renderFill', toggle, renderingEngineId, viewportId);
    },
  });

  addSliderToToolbar({
    title: 'outline width active',
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineWidthActive',
        value,
        renderingEngineId,
        viewportId,
      );
    },
    range: [1, 5],
    toolbar,
  });

  addSliderToToolbar({
    title: 'outline alpha active',
    defaultValue: 100,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineOpacity',
        Number(value) / 100,
        renderingEngineId,
        viewportId,
      );
    },
    range: [0, 100],
    toolbar,
  });
  addSliderToToolbar({
    title: 'outline width inactive',
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineWidthInactive',
        value,
        renderingEngineId,
        viewportId,
      );
    },
    range: [1, 5],
    toolbar,
  });
  addSliderToToolbar({
    title: 'fill alpha',
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;

      setConfigValue('fillAlpha', mappedValue, renderingEngineId, viewportId);
    },
    range: [0, 100],
    toolbar,
  });
  addSliderToToolbar({
    title: 'fill alpha inactive',
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;
      setConfigValue(
        'fillAlphaInactive',
        mappedValue,
        renderingEngineId,
        viewportId,
      );
    },
    range: [0, 100],
    toolbar,
  });

  // ===========

  // Add some segmentations based on the source data volume
  const segmentationId1 = 'segmentationId1' + Date.now();
  const segmentationId2 = 'segmentationId2' + Date.now();

  await addSegmentationsToState(volumeId, segmentationId1, segmentationId2);

  // // Add the segmentation representations to the toolgroup
  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId: segmentationId1,
      type: SegmentationRepresentations.Labelmap,
    },
    {
      segmentationId: segmentationId2,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);
};

/**
 * Adds two concentric circles to each axial slice of the demo segmentation.
 */
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

function setConfigValue(
  property: any,
  value: any,
  renderingEngineId: any,
  viewportId: any,
) {
  const config = segmentation.config.getGlobalConfig();
  if (config.representations && config.representations.LABELMAP) {
    (config.representations.LABELMAP as any)[property] = value;
  } else return;

  segmentation.config.setGlobalConfig(config);

  const renderingEngine = getRenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
  renderingEngine.renderViewports([viewportId]);
}
