import {
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  initDemo,
  setCtTransferFunctionForVolumeActor,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->',
);

export const initVolumeBasic = (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
) => {
  const { ViewportType } = Enums;

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Basic Volume',
    'Displays a DICOM series in a Volume viewport.',
  );

  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = idName + '-cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';

  content?.appendChild(element);
  // ============================= //

  /**
   * Runs the demo
   */
  async function run() {
    // Init Cornerstone and related libraries
    const gcp = true;
    await initDemo(gcp);

    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );
    // const imageIds =  createImageIdsAndCacheMetaData({
    //   gcp,
    //   SeriesInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    //   StudyInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
    // });

    // Instantiate a rendering engine
    const renderingEngineId = idName + '-RenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
    const viewportId = 'CT_SAGITTAL_STACK';
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
    console.log('viewport --- 1', viewport.sWidth);

    // Define a unique id for the volume
    const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
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
    console.log('viewport --- 2', viewport.sWidth);
    // Render the image
    // viewport.setProperties({ voiRange: { lower: -1500, upper: 2500 } });


    console.log('DerivativeDiscription', DerivativeDiscription);
    if (DerivativeDiscription.includes('VSRAD'))
      viewport.setProperties({ voiRange: { lower: 0, upper: 1500 } });
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

    viewport.render();

    console.log('viewport --- 3', viewport.sWidth);
    console.log('viewport --- 4', JSON.stringify(viewport, null, 2));
  }

  run();
};
