import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  camera as cameraHelpers,
  initDemo,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

// This is for debugging purposes
console.warn(
  'This is for debugging purposes: Click on index.ts to open source code for this example --------->',
);

export const initStackAPI = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  // if (!content) return;
  const { Events, ViewportType } = Enums;

  // ======== Constants ======= //
  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = idName;

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Stack Viewport API',
    'Demonstrates how to interact with a Stack viewport.',
  );
  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = idName + '-cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';

  content?.appendChild(element);

  const info = document.createElement('div');
  content?.appendChild(info);

  const rotationInfo = document.createElement('div');
  info.appendChild(rotationInfo);

  const flipHorizontalInfo = document.createElement('div');
  info.appendChild(flipHorizontalInfo);

  const flipVerticalInfo = document.createElement('div');
  info.appendChild(flipVerticalInfo);

  element.addEventListener(Events.CAMERA_MODIFIED, (_) => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);

    // Get the stack viewport
    const viewport = <Types.IStackViewport>(
      renderingEngine?.getViewport(viewportId)
    );

    if (!viewport) {
      return;
    }

    const { flipHorizontal, flipVertical } = viewport.getCamera();
    const { rotation } = viewport.getProperties();

    rotationInfo.innerText = `Rotation: ${Math.round(rotation || 0)}`;
    flipHorizontalInfo.innerText = `Flip horizontal: ${flipHorizontal}`;
    flipVerticalInfo.innerText = `Flip vertical: ${flipVertical}`;
  });

  addButtonToToolbar({
    title: 'Set VOI Range',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Set a range to highlight bones
      viewport.setProperties({ voiRange: { lower: -1500, upper: 2500 } });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Next Image',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();

      // Increment the index, clamping to the last image if necessary
      const numImages = viewport.getImageIds().length;
      let newImageIdIndex = currentImageIdIndex + 1;

      newImageIdIndex = Math.min(newImageIdIndex, numImages - 1);

      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });

  addButtonToToolbar({
    title: 'Previous Image',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();

      // Increment the index, clamping to the first image if necessary
      let newImageIdIndex = currentImageIdIndex - 1;

      newImageIdIndex = Math.max(newImageIdIndex, 0);

      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });

  addButtonToToolbar({
    title: 'Flip H',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

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

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      const { flipVertical } = viewport.getCamera();

      viewport.setCamera({ flipVertical: !flipVertical });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Rotate Random',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      const rotation = Math.random() * 360;

      viewport.setProperties({ rotation });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Rotate Absolute 150',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      viewport.setProperties({ rotation: 150 });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Rotate Delta 30',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      const { rotation } = viewport.getProperties();
      viewport.setProperties({ rotation: rotation || 0 + 30 });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Invert',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      const { invert } = viewport.getProperties();

      viewport.setProperties({ invert: !invert });

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
      const viewport = <Types.IStackViewport>(
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

      const newCamera = {
        focalPoint: <Types.Point3>focalPoint,
        parallelScale,
        position: <Types.Point3>position,
      };

      viewport.setCamera(newCamera);
      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Reset Viewport',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Resets the viewport's camera
      viewport.resetCamera();
      // Resets the viewport's properties
      viewport.resetProperties();
      viewport.render();
    },
  });

  /**
   * Runs the demo
   */
  const run = async () => {
    // Init Cornerstone and related libraries
    const gcp = true;
    await initDemo(gcp);

    // Instantiate a rendering engine
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport

    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[0.8, 0, 0.2],
      },
      element: element,
      type: ViewportType.STACK,
      viewportId,
    };

    renderingEngine.enableElement(viewportInput);

    // Get the stack viewport that was created
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );


    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );

    imageIds.sort();


    // Define a stack containing a few images
    // const stack = [imageIds[0], imageIds[1], imageIds[2], imageIds[3]];
const stack = imageIds
    // Set the stack on the viewport
    await viewport.setStack(stack);

    // Set the VOI of the stack
    // viewport.setProperties({ voiRange: { lower: -1500, upper: 2500 } });
    if (DerivativeDiscription.includes('T1'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 1500 } });
    if (DerivativeDiscription.includes('T2 '))
      //注意：T2の後ろに半角スペースが入っている
      viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });
    if (DerivativeDiscription.includes('FLAIR'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 1500 } });
    if (DerivativeDiscription.includes('DWI'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 1000 } });
    if (DerivativeDiscription.includes('Apparent Diffusion Coefficient'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });
    if (DerivativeDiscription.includes('T2*'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });
    // Render the image
    viewport.render();
  };
  run();
};
