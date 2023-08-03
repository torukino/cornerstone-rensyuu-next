import { Enums, RenderingEngine, Types } from '@cornerstonejs/core';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo, setTitleAndDescription } from '@/tools/cornerstoneTools';

export const initStackBasic = async (idName: string): Promise<void> => {

  
  // This is for debugging purposes
  console.warn(
    'Click on index.ts to open source code for this example --------->',
  );

  const { ViewportType } = Enums;

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Basic Stack',
    'Displays a single DICOM image in a Stack viewport.',
  );

  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = idName + 'cornerstone-element';
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
    const renderingEngineId = idName + '-RenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
    const viewportId = 'CT_STACK';
    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[0.5, 0.2, 0.2],// 背景色
      },
      element,// 画像を表示する要素
      type: ViewportType.STACK,// 画像を表示するタイプ
      viewportId,// 画像を表示するID
    };

    renderingEngine.enableElement(viewportInput);// 画像を表示する要素を有効化

    // Get the stack viewport
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );

    // Define a stack containing a single image
    const stack = [imageIds[0]];

    // Set the stack on the viewport
    await viewport.setStack(stack);

    // Set the VOI of the stack
    viewport.setProperties({ voiRange: { lower: -1500, upper: 2500 } });

    // Render the image
    viewport.render();
  }

  run();
};
