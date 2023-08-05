import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  initDemo,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

export const initStackBasic = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const { ViewportType } = Enums;
  // ======== Constants ======= //
  const renderingEngineId = 'myRenderingEngine';
  const viewportId = ' MRI_STACK';
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
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );

    imageIds.sort();

    console.log('imageIds', imageIds.length);

    // Instantiate a rendering engine
    const renderingEngineId = idName + '-RenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
    const viewportId = ' MRI_STACK';
    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[0.8, 0.0, 0.2], // 背景色
      },
      element, // 画像を表示する要素
      type: ViewportType.STACK, // 画像を表示するタイプ
      viewportId, // 画像を表示するID
    };

    renderingEngine.enableElement(viewportInput); // 画像を表示する要素を有効化

    // Get the stack viewport
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );

    // Define a stack containing all image
    const stack = imageIds;
    // console.log(JSON.stringify(imageIds, null, 2));

    // Set the stack on the viewport
    await viewport.setStack(stack);
    /**
     *
     * Set the VOI of the stack
     * T1：{ lower: 0, upper: 800 }
     * T2：{ lower: 0, upper: 2000 }
     * T2*：{ lower: 0, upper: 500 }
     * FLAIR：{ lower: 0, upper: 1500 }
     * DWI（拡散強調画像）：{ lower: 0, upper: 1000 } あるいは { lower: 0, upper: 2000 }の範囲で調整可能です。
     * ADC（表現拡散係数）：{ lower: 0, upper: 2000 }あるいは { lower: 0, upper: 3000 } の範囲で調整可能です
     */
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

    addButtonToToolbar({
      title: '次',
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
        console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
        // Set the new image index, the viewport itself does a re-render
        viewport.setImageIdIndex(newImageIdIndex);
      },
    });

    addButtonToToolbar({
      title: '前',
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
        console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
        // Set the new image index, the viewport itself does a re-render
        viewport.setImageIdIndex(newImageIdIndex);
      },
    });
  }
  run();
};
