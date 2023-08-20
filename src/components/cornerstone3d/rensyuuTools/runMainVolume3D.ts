import {
  Enums,
  RenderingEngine,
  setVolumesForViewports,
  Types,
  utilities,
  volumeLoader,
} from '@cornerstonejs/core';
import { VIEWPORT_PRESETS } from '@cornerstonejs/core/dist/esm/constants';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import { ToolGroupManager, TrackballRotateTool } from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { addDropdownToToolbar, initDemo } from '@/tools/cornerstoneTools';

export const runMainVolume3D = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const gcp = true;
  await initDemo(gcp);
  const toolGroupId = 'TOOL_GROUP_ID';
  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  const element: HTMLDivElement = getElement();
  content.appendChild(element);

  /********************
   * 3D ここから追加
   */
  const size = '500px';
  const viewportGrid = document.createElement('div');

  viewportGrid.style.display = 'flex';
  viewportGrid.style.display = 'flex';
  viewportGrid.style.flexDirection = 'row';

  const element1 = document.createElement('div');
  element1.oncontextmenu = () => false;

  element1.style.width = size;
  element1.style.height = size;

  viewportGrid.appendChild(element1);

  content.appendChild(viewportGrid);

  const instructions = document.createElement('p');
  instructions.innerText = 'Click the image to rotate it.';

  content.append(instructions);
  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;
  addDropdownToToolbar({
    container,
    idName,
    onSelectedValueChange: (presetName) => {
      const volumeActor = renderingEngine
        .getViewport(viewportId)
        .getDefaultActor().actor as Types.VolumeActor;

      const preset = VIEWPORT_PRESETS.find((preset) => preset.name === presetName);
      if (preset) {
        utilities.applyPreset(volumeActor, preset);
      }

      renderingEngine.render();
    },
    options: {
      defaultValue: 'CT-Bone',
      values: VIEWPORT_PRESETS.map(
        (preset) => preset.name,
      ),
    },
  });

  // ここまで追加
  // Define a unique id for the volume
  let renderingEngine: RenderingEngine;
  const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
  const viewportId = '3D_VIEWPORT';
  const renderingEngineId = idName + '-RenderingEngine';

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(TrackballRotateTool);

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;
  // Add the tools to the tool group and specify which volume they are pointing at
  toolGroup.addTool(TrackballRotateTool.toolName, {
    configuration: { volumeId },
  });

  // Set the initial state of the tools, here we set one tool active on left click.
  // This means left click will draw that tool.
  toolGroup.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });

  // Instantiate a rendering engine
  renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
  // Create the viewports

  const viewportInputArray = [
    {
      defaultOptions: {
        background: <Types.Point3>[0.2, 0, 0.2],
        orientation: Enums.OrientationAxis.CORONAL,
      },
      element: element1,
      type: ViewportType.VOLUME_3D,
      viewportId: viewportId,
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the tool group on the viewports
  toolGroup.addViewport(viewportId, renderingEngineId);

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Set the volume to load
  volume.load();

  setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]).then(
    () => {
      const volumeActor = renderingEngine
        .getViewport(viewportId)
        .getDefaultActor().actor as Types.VolumeActor;

      const preset = VIEWPORT_PRESETS.find(
        (preset) => preset.name === 'CT-Bone',
      );
      if (preset) {
        utilities.applyPreset(volumeActor, preset);
      }
      viewport.render();
    },
  );

  const viewport = renderingEngine.getViewport(viewportId);
  renderingEngine.render();
};
