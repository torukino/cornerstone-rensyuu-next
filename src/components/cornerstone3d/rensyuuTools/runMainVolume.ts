import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  addDropdownToToolbar,
  addSliderToToolbar,
  initDemo,
  setCtTransferFunctionForVolumeActor,
} from '@/tools/cornerstoneTools';

export const runMainVolume = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const gcp = true;
  await initDemo(gcp);

  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  const element: HTMLDivElement = getElement();
  content.appendChild(element);

  const renderingEngineId = idName + '-RenderingEngine';

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  //レンダリング・エンジンをインスタンス化する
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create a stack viewport
  const viewportId = 'MRI_SAGITTAL_STACK';
  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
      orientation: Enums.OrientationAxis.SAGITTAL,
    },
    element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId,
  };

  renderingEngine.enableElement(viewportInput);

  // Get the stack viewport that was created
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );

  // Define a unique id for the volume
  const volumeName = 'MRI_VOLUME_ID'; // Id of the volume less loader prefix
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Set the volume to load
  volume.load();

  // Set the volume on the viewport
  viewport.setVolumes([
    { callback: setCtTransferFunctionForVolumeActor, volumeId },
  ]);

  // Buttons
  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;
  addButtonToToolbar({
    title: 'Set VOI Range',
    container,
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) return;
      // Get the stack viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine.getViewport(viewportId)
      );

      viewport.setProperties({ voiRange: { lower: 0, upper: 2500 } });
      viewport.render();
    },
  });

  const orientationOptions = {
    axial: 'axial',
    coronal: 'coronal',
    oblique: 'oblique',
    sagittal: 'sagittal',
  };

  addDropdownToToolbar({
    container,
    idName,
    onSelectedValueChange: (selectedValue) => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) return;
      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine.getViewport(viewportId)
      );

      let viewUp: Types.Point3;
      let viewPlaneNormal: Types.Point3;

      switch (selectedValue) {
        case orientationOptions.axial:
          viewport.setOrientation(Enums.OrientationAxis.AXIAL);

          break;
        case orientationOptions.sagittal:
          viewport.setOrientation(Enums.OrientationAxis.SAGITTAL);

          break;
        case orientationOptions.coronal:
          viewport.setOrientation(Enums.OrientationAxis.CORONAL);
          break;
        case orientationOptions.oblique:
          // Some random oblique value for this dataset
          viewUp = [
            -0.5962687530844388, 0.5453181550345819, -0.5891448751239446,
          ];
          viewPlaneNormal = [
            -0.5962687530844388, 0.5453181550345819, -0.5891448751239446,
          ];

          viewport.setCamera({ viewPlaneNormal, viewUp });
          viewport.resetCamera();

          break;
        default:
          throw new Error('undefined orientation option');
      }

      // TODO -> Maybe we should have a helper for this on the viewport
      // Set the new orientation
      // Reset the camera after the normal changes
      viewport.render();
    },
    options: {
      defaultValue: 'sagittal',
      values: ['axial', 'sagittal', 'coronal', 'oblique'],
    },
  });

  addSliderToToolbar({
    title: 'Slab Thickness',
    container,
    defaultValue: 0,
    idName,
    onSelectedValueChange: (value) => {
      let valueAsNumber = Number(value);

      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) return;
      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine.getViewport(viewportId)
      );

      let blendMode = Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;

      if (valueAsNumber < 0.1) {
        // Cannot render zero thickness
        valueAsNumber = 0.1;

        // Not a mip, just show slice
        blendMode = Enums.BlendModes.COMPOSITE;
      }

      viewport.setBlendMode(blendMode);
      viewport.setSlabThickness(valueAsNumber);
      viewport.render();
    },
    range: [0, 50],
  });
};
