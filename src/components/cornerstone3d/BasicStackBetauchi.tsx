'use client';

import {
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';
import React, { useEffect } from 'react';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import ViewportType from '@/enums/cornerstone/ViewportType';
import { initDemo } from '@/tools/cornerstoneTools';
import addButtonToToolbarBetauchi from '@/tools/cornerstoneTools/addButtonToToolbarBetauchi';

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasicBetauchi: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'stackBasicBetauchi';

  const run = async (
    idName: string,
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
  ): Promise<void> => {
    const content = document.getElementById(idName + '-content');
    const element = document.createElement('div');
    element.id = idName + 'cornerstone-element';
    element.style.width = '500px';
    element.style.height = '500px';
    content && content.appendChild(element);
    const gcp = true;
    await initDemo(gcp);
    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );

    imageIds.sort();

    // Instantiate a rendering engine
    const renderingEngineId = idName + '-RenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
    const viewportId = ' MRI_STACK';
    const viewportInput = {
      defaultOptions: {
        background: [0.8, 0.0, 0.2] as Types.Point3, // 背景色
      },
      element, // 画像を表示する要素
      type: ViewportType.STACK, // 画像を表示するタイプ
      viewportId, // 画像を表示するID
    };

    renderingEngine.enableElement(viewportInput); // 画像を表示する要素を有効化

    // Get the stack viewport
    const viewport = renderingEngine.getViewport(
      viewportId,
    ) as Types.IStackViewport;
    // Define a stack containing all image
    const stack = imageIds;
    // console.log(JSON.stringify(imageIds, null, 2));

    // Set the stack on the viewport
    await viewport.setStack(stack);

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

    const container = document.getElementById(`${idName}-toolbar`);
    container &&
      addButtonToToolbarBetauchi({
        title: '次',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          // Get the current index of the image displayed
          const currentImageIdIndex = viewport.getCurrentImageIdIndex();

          // Increment the index, clamping to the last image if necessary
          const numImages = viewport.getImageIds().length;
          let newImageIdIndex = currentImageIdIndex + 1;
          if (BUG) {
            newImageIdIndex = Math.min(newImageIdIndex, numImages - 1);
            console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
            const NoOfImgs = imageIds[newImageIdIndex]
              .split('/')[18]
              .split('.');
            console.log(NoOfImgs[NoOfImgs.length - 1]);
          }

          // Set the new image index, the viewport itself does a re-render
          viewport.setImageIdIndex(newImageIdIndex);
        },
      });
    container &&
      addButtonToToolbarBetauchi({
        title: '前',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          // Get the current index of the image displayed
          const currentImageIdIndex = viewport.getCurrentImageIdIndex();

          // Increment the index, clamping to the first image if necessary
          let newImageIdIndex = currentImageIdIndex - 1;

          newImageIdIndex = Math.max(newImageIdIndex, 0);
          if (BUG) {
            console.log('@@@@@@@@@@@@@@@@@@@', newImageIdIndex);
            const NoOfImgs = imageIds[newImageIdIndex]
              .split('/')[18]
              .split('.');
            console.log(NoOfImgs[NoOfImgs.length - 1]);
            console.log(
              JSON.stringify(imageIds[newImageIdIndex].split('/'), null, 2),
            );
          }

          // Set the new image index, the viewport itself does a re-render
          viewport.setImageIdIndex(newImageIdIndex);
        },
      });
  };

  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID && DerivativeDiscription) {
      run(idName, SeriesInstanceUID, StudyInstanceUID, DerivativeDiscription);
    }
    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
    };
  }, [SeriesInstanceUID, StudyInstanceUID, DerivativeDiscription]);
  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>
      <div
        id={`${idName}-toolbar`}
        className="justify-between text-blue-500"
      ></div>
      <div
        id={`${idName}-content`}
        className="h-[800px] w-[400px] items-center"
      ></div>
    </div>
  );
};

export default StackBasicBetauchi;
