import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
  utilities,
  volumeLoader,
} from '@cornerstonejs/core';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  addDropdownToToolbar,
  addSliderToToolbar,
  camera as cameraHelpers,
  initDemo,
  setCtTransferFunctionForVolumeActor,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->',
);

export const initVolumeAPI = async (idName: string): Promise<void> => {
  const { ViewportType } = Enums;

  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = 'CT_SAGITTAL_STACK';

  // Define a unique id for the volume
  const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  const volumeLoaderScheme = idName + '-cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Volume Viewport API',
    'Demonstrates how to interact with a Volume viewport.',
  );

  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = idName + '-cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';

  content?.appendChild(element);
  // ============================= //

  // TODO -> Maybe some of these implementations should be pushed down to some API

  // Buttons
  addButtonToToolbar({
    title: 'Set VOI Range',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      viewport.setProperties({ voiRange: { lower: -1500, upper: 2500 } });
      viewport.render();
    },
  });
  addButtonToToolbar({
    title: 'Flip H',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Flip the viewport horizontally
      const { flipHorizontal } = viewport.getCamera();
      viewport.setCamera({ flipHorizontal: !flipHorizontal });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Flip V',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Flip the viewport vertically
      const { flipVertical } = viewport.getCamera();

      viewport.setCamera({ flipVertical: !flipVertical });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Invert',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Get the volume actor from the viewport
      const actorEntry = viewport.getActor(volumeId);

      const volumeActor = actorEntry.actor as Types.VolumeActor;
      const rgbTransferFunction = volumeActor
        .getProperty()
        .getRGBTransferFunction(0);

      // Todo: implement invert in setProperties
      utilities.invertRgbTransferFunction(rgbTransferFunction);

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Apply Random Zoom And Pan',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Reset the camera so that we can set some pan and zoom relative to the
      // defaults for this demo. Note that changes could be relative instead.
      viewport.resetCamera();

      // Get the current camera properties
      const camera = viewport.getCamera();

      const { focalPoint, parallelScale, position } =
        cameraHelpers.getRandomlyTranslatedAndZoomedCameraProperties(
          camera,
          50,
        );

      viewport.setCamera({
        focalPoint: <Types.Point3>focalPoint,
        parallelScale,
        position: <Types.Point3>position,
      });
      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Reset Viewport',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Resets the viewport's camera
      viewport.resetCamera();
      // TODO reset the viewport properties, we don't have API for this.

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
    idName,
    onSelectedValueChange: (selectedValue) => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      let viewUp: [number, number, number];
      let viewPlaneNormal: [number, number, number];

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
    defaultValue: 0,
    idName,
    onSelectedValueChange: (value) => {
      let valueAsNumber = Number(value);

      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine?.getViewport(viewportId)
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

  /**
   * Runs the demo
   */
  async function run() {
    // Init Cornerstone and related libraries
    const gcp = true;
    await initDemo(gcp);

    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await getImageIds(gcp);

    // createImageIdsAndCacheMetaData({
    //   gcp,
    //   SeriesInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    //   StudyInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
    // });

    // Instantiate a rendering engine
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
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

    // Render the image
    viewport.render();
  }

  run();
};
