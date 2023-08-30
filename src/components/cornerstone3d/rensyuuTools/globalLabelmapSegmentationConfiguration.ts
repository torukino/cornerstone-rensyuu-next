import { Enums, getRenderingEngine } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  addSliderToToolbar,
  addToggleButtonToToolbar,
} from 'src\toolscornerstoneTools';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->',
);

export const globalLabelmapSegmentationConfiguration = (
  element: HTMLDivElement,
  idName: string,
  imageIds: string[],
  renderingEngineId: string,
  viewportId: string,
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

  function setConfigValue(property: any, value: any) {
    const config = segmentation.config.getGlobalConfig();

    if (config.representations && config.representations.LABELMAP) {
      config.representations.LABELMAP[property] = value;
    }

    segmentation.config.setGlobalConfig(config);

    const renderingEngine = getRenderingEngine(renderingEngineId);
    if (!renderingEngine) return;
    renderingEngine.renderViewports([viewportId]);
  }

  addToggleButtonToToolbar({
    title: 'toggle render inactive segmentations',
    defaultToggle: true,
    onClick: (toggle) => {
      const config = segmentation.config.getGlobalConfig();

      config.renderInactiveSegmentations = toggle;
      segmentation.config.setGlobalConfig(config);

      const renderingEngine = getRenderingEngine(renderingEngineId);

      renderingEngine.renderViewports([viewportId]);
    },
  });
  addToggleButtonToToolbar({
    title: 'toggle outline rendering',
    defaultToggle: true,
    onClick: (toggle) => {
      setConfigValue('renderOutline', toggle);
    },
  });
  addToggleButtonToToolbar({
    title: 'toggle fill rendering',
    defaultToggle: true,
    onClick: (toggle) => {
      setConfigValue('renderFill', toggle);
    },
  });

  addSliderToToolbar({
    title: 'outline width active',
    defaultValue: 1,
    onSelectedValueChange: (value) => {
      setConfigValue('outlineWidthActive', value);
    },
    range: [1, 5],
  });
  addSliderToToolbar({
    title: 'outline alpha active',
    defaultValue: 100,
    onSelectedValueChange: (value) => {
      setConfigValue('outlineOpacity', Number(value) / 100);
    },
    range: [0, 100],
  });
  addSliderToToolbar({
    title: 'outline width inactive',
    defaultValue: 1,
    onSelectedValueChange: (value) => {
      setConfigValue('outlineWidthInactive', value);
    },
    range: [1, 5],
  });
  addSliderToToolbar({
    title: 'fill alpha',
    defaultValue: 50,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;

      setConfigValue('fillAlpha', mappedValue);
    },
    range: [0, 100],
  });
  addSliderToToolbar({
    title: 'fill alpha inactive',
    defaultValue: 50,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;
      setConfigValue('fillAlphaInactive', mappedValue);
    },
    range: [0, 100],
  });

  console.log('globalLabelmapSegmentationConfiguration');
};
