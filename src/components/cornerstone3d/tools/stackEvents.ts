import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  ctVoiRange,
  initDemo,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

export const initStackEvents = async (idName: string): Promise<void> => {
  // This is for debugging purposes
  console.warn(
    'Click on index.ts to open source code for this example --------->',
  );

  const { ViewportType } = Enums;

  // ======== Constants ======= //
  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = idName;

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Stack Events',
    'Shows events emitted by Cornerstone Stack Viewports.',
  );

  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = idName + '-cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';

  content?.appendChild(element);

  const lastEvents: any[] = [];
  const lastEventsDiv = document.createElement('div');

  content?.appendChild(lastEventsDiv);

  function updateLastEvents(number: any, eventName: any, detail: any) {
    if (lastEvents.length > 4) {
      lastEvents.pop();
    }

    lastEvents.unshift({ detail, eventName, number });

    // Display
    lastEventsDiv.innerHTML = '';

    lastEvents.forEach((le) => {
      const element = document.createElement('p');

      element.style.border = '1px solid black';
      element.innerText = le.number + ' ' + le.eventName + '\n\n' + le.detail;

      lastEventsDiv.appendChild(element);
    });
  }

  let eventNumber = 1;

  const { CAMERA_MODIFIED, IMAGE_RENDERED, STACK_NEW_IMAGE } = Enums.Events;

  element.addEventListener(IMAGE_RENDERED, ((
    evt: Types.EventTypes.ImageRenderedEvent,
  ) => {
    updateLastEvents(eventNumber, IMAGE_RENDERED, JSON.stringify(evt.detail));
    eventNumber++;
  }) as EventListener);

  element.addEventListener(CAMERA_MODIFIED, ((
    evt: Types.EventTypes.CameraModifiedEvent,
  ) => {
    updateLastEvents(eventNumber, CAMERA_MODIFIED, JSON.stringify(evt.detail));
    eventNumber++;
  }) as EventListener);

  element.addEventListener(STACK_NEW_IMAGE, ((
    evt: Types.EventTypes.StackNewImageEvent,
  ) => {
    // Remove the image since then we serialize a bunch of pixelData to the screen.
    const { imageId, renderingEngineId, viewportId } = evt.detail;
    const detail = {
      image: 'cornerstoneImageObject',
      imageId,
      renderingEngineId,
      viewportId,
    };

    updateLastEvents(eventNumber, STACK_NEW_IMAGE, JSON.stringify(detail));
    eventNumber++;
  }) as EventListener);

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
      const { focalPoint, parallelScale, position, viewPlaneNormal, viewUp } =
        camera;

      // Modify the zoom by some factor
      const randomModifier = 0.5 + Math.random() - 0.5;
      const newParallelScale = parallelScale || 1 * randomModifier;

      // Move the camera in plane by some random number
      const viewRight = vec3.create(); // Get the X direction of the viewport

      vec3.cross(viewRight, <vec3>viewUp, <vec3>viewPlaneNormal);

      const randomPanX = 50 * (2.0 * Math.random() - 1);
      const randomPanY = 50 * (2.0 * Math.random() - 1);

      const diff = [0, 0, 0];

      // Pan X
      for (let i = 0; i <= 2; i++) {
        diff[i] += viewRight[i] * randomPanX;
      }

      // Pan Y
      for (let i = 0; i <= 2; i++) {
        diff[i] += viewUp?.[i] || 1 * randomPanY;
      }

      const newPosition = [];
      const newFocalPoint = [];

      for (let i = 0; i <= 2; i++) {
        newPosition[i] = position?.[i] || 0 + diff[i];
        newFocalPoint[i] = focalPoint?.[i] || 0 + diff[i];
      }

      viewport.setCamera({
        focalPoint: <Types.Point3>newFocalPoint,
        parallelScale: newParallelScale,
        position: <Types.Point3>newPosition,
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
  async function run() {
    // Init Cornerstone and related libraries
    const gcp = true;
    await initDemo(gcp);

    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await getImageIds(gcp);

    // Instantiate a rendering engine
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport

    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[0.2, 0, 0.2],
      },
      element,
      type: ViewportType.STACK,
      viewportId,
    };

    renderingEngine.enableElement(viewportInput);

    // Get the stack viewport that was created
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );

    // Define a stack containing a single image
    const stack = [imageIds[0], imageIds[1], imageIds[2]];

    // Set the stack on the viewport
    await viewport.setStack(stack);

    // Set the VOI of the stack
    viewport.setProperties({ voiRange: ctVoiRange });

    // Render the image
    viewport.render();
  }

  run();
};
