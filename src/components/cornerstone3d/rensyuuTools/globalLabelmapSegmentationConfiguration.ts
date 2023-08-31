import {
  Enums,
  getRenderingEngine,
  ImageVolume,
  RenderingEngine,
  setVolumesForViewports,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { LabelmapConfig } from '@cornerstonejs/tools/dist/esm/types/LabelmapTypes';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addSliderToToolbar,
  addToggleButtonToToolbar,
  initDemo,
} from '@/tools/cornerstoneTools';
// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->',
);

export const globalLabelmapSegmentationConfiguration = async (
  element: HTMLDivElement,
  idName: string,
  renderingEngineId: string,
  viewportId: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
) => {
  const {
    Enums: csToolsEnums,
    segmentation,
    SegmentationDisplayTool,
    ToolGroupManager,
  } = cornerstoneTools;

  const { ViewportType } = Enums;

  // Define a unique id for the volume
  const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
  const segmentationId1 = 'SEGMENTATION_ID_1';
  const segmentationId2 = 'SEGMENTATION_ID_2';
  const toolGroupId = 'MY_ TOOL_GROUP_ID';

  const content = document.getElementById(`${idName}-content`);
  if (!content) return;
  content.appendChild(element);

  function setConfigValue(property: keyof LabelmapConfig, value: any) {
    const config = segmentation.config.getGlobalConfig();

    if (config.representations && config.representations.LABELMAP) {
      config.representations.LABELMAP[property] = value;
    }

    segmentation.config.setGlobalConfig(config);

    const renderingEngine = getRenderingEngine(renderingEngineId);
    if (!renderingEngine) return;
    renderingEngine.renderViewports([viewportId]);
  }
  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;

  addToggleButtonToToolbar({
    title: 'toggle render inactive segmentations',
    defaultToggle: true,
    onClick: (toggle: boolean) => {
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
    onClick: (toggle: any) => {
      setConfigValue('renderOutline', toggle);
    },
  });
  addToggleButtonToToolbar({
    title: 'toggle fill rendering',
    defaultToggle: true,
    onClick: (toggle: boolean) => {
      setConfigValue('renderFill', toggle);
    },
  });

  addSliderToToolbar({
    title: 'outline width active',
    container,
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value: any) => {
      setConfigValue('outlineWidthActive', value);
    },
    range: [1, 5],
  });

  addSliderToToolbar({
    title: 'outline alpha active',
    container,
    defaultValue: 100,
    idName,
    onSelectedValueChange: (value: any) => {
      setConfigValue('outlineOpacity', Number(value) / 100);
    },
    range: [0, 100],
  });
  addSliderToToolbar({
    title: 'outline width inactive',
    container,
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value: any) => {
      setConfigValue('outlineWidthInactive', value);
    },
    range: [1, 5],
  });

  addSliderToToolbar({
    title: 'fill alpha',
    container,
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value: any) => {
      const mappedValue = Number(value) / 100.0;

      setConfigValue('fillAlpha', mappedValue);
    },
    range: [0, 100],
  });
  addSliderToToolbar({
    title: 'fill alpha inactive',
    container,
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value: any) => {
      const mappedValue = Number(value) / 100.0;
      setConfigValue('fillAlphaInactive', mappedValue);
    },
    range: [0, 100],
  });
  /***************************
   *
   */
  /**
   * Adds two concentric circles to each axial slice of the demo segmentation.
   */
  function fillSegmentationWithCircles(
    segmentationVolume: ImageVolume,
    centerOffset: number[],
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
            (x - center[0]) * (x - center[0]) +
              (y - center[1]) * (y - center[1]),
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

  async function addSegmentationsToState() {
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
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
        },
        segmentationId: segmentationId1,
      },
      {
        representation: {
          data: {
            volumeId: segmentationId2,
          },
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
        },
        segmentationId: segmentationId2,
      },
    ]);

    // Add some data to the segmentations
    fillSegmentationWithCircles(segmentationVolume1, [50, 50]);
    fillSegmentationWithCircles(segmentationVolume2, [-50, -50]);
  }
  const gcp = true;
  await initDemo(gcp);
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Add some segmentations based on the source data volume
  await addSegmentationsToState();

  // Instantiate a rendering engine
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports
  const viewportInput = {
    defaultOptions: {
      background: [0.2, 0, 0.2] as Types.Point3,
      orientation: Enums.OrientationAxis.AXIAL,
    },
    element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId,
  };

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(SegmentationDisplayTool);

  // Define tool groups to add the segmentation display tool to
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup.addViewport(viewportId, renderingEngineId);

  renderingEngine.enableElement(viewportInput);

  // Set the volume to load
  volume.load();

  // Set volumes on the viewports
  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);

  // // Add the segmentation representations to the toolgroup
  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId: segmentationId1,
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
    },
    {
      segmentationId: segmentationId2,
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
    },
  ]);

  // Render the image
  renderingEngine.renderViewports([viewportId]);
  console.log('globalLabelmapSegmentationConfiguration');
};
