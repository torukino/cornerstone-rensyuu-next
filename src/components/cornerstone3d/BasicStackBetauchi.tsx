'use client';
import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import React, { useEffect } from 'react';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import ViewportType from '@/enums/cornerstone/ViewportType';
import {
  addButtonToToolbar,
  camera as cameraHelpers,
  initDemo,
} from '@/tools/cornerstoneTools';

const {
  Enums: csToolsEnums,
  ToolGroupManager,
  WindowLevelTool,
} = cornerstoneTools;

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
  const { MouseBindings } = csToolsEnums;
  const toolGroupId = 'STACK_TOOL_GROUP_ID';

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
    content?.appendChild(element);

    //Eventsを表示するためのdiv
    const lastEvents: any[] = [];
    const lastEventsDiv = document.createElement('div');
    content?.appendChild(lastEventsDiv);

    function updateLastEvents(
      number: number,
      eventName: string,
      detail: string,
    ) {
      if (lastEvents.length > 4) {
        // `lastEvents`配列の末尾から要素を削除する
        lastEvents.pop();
      }
      // `detail`、`eventName`、`number`をプロパティとして持つオブジェクトを作成し、`lastEvents`配列の先頭に追加する
      lastEvents.unshift({ detail, eventName, number });

      // Display
      lastEventsDiv.innerHTML = '';

      lastEvents.forEach((le) => {
        const element = document.createElement('p');
        element.className = 'border border-black p-2 text-blue-500 text-sm whitespace-normal';
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
      updateLastEvents(
        eventNumber,
        CAMERA_MODIFIED,
        JSON.stringify(evt.detail),
      );
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

    // マウスの座標を取得するためのHTML要素を作成
    const mousePosDiv = document.createElement('div');
    const canvasPosElement = document.createElement('p');
    const worldPosElement = document.createElement('p');
    canvasPosElement.innerText = 'canvas:';
    worldPosElement.innerText = 'world:';
    content?.appendChild(mousePosDiv);

    mousePosDiv.appendChild(canvasPosElement);
    mousePosDiv.appendChild(worldPosElement);
    // Get the viewport element
    element.addEventListener('mousemove', (evt) => {
      const rect = element.getBoundingClientRect();
      const canvasPos: Types.Point2 = [
        Math.floor(evt.clientX - rect.left),
        Math.floor(evt.clientY - rect.top),
      ];
      // Convert canvas coordinates to world coordinates
      const worldPos = viewport.canvasToWorld(canvasPos);

      canvasPosElement.innerText = `canvas座標: (${canvasPos[0]}, ${canvasPos[1]})`;
      worldPosElement.innerText = `world座標: (${worldPos[0].toFixed(
        2,
      )}, ${worldPos[1].toFixed(2)}, ${worldPos[2].toFixed(2)})`;
    });
    canvasPosElement.className = 'text-xl text-blue-800';
    worldPosElement.className = 'text-xl text-blue-800';
    //ここまで

    const gcp = true;
    await initDemo(gcp);

    // Add tools to Cornerstone3D
    try {
      cornerstoneTools.addTool(WindowLevelTool);
    } catch (e) {
      console.log('error', e);
    }
    // Define a tool group, which defines how mouse events map to tool commands for
    // Any viewport using the group
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // Add the tools to the tool group
    toolGroup?.addTool(WindowLevelTool.toolName);

    // Set the initial state of the tools, here we set one tool active on left click.
    // This means left click will draw that tool.
    toolGroup?.setToolActive(WindowLevelTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });

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
    toolGroup?.addViewport(viewportId, renderingEngineId);
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
      addButtonToToolbar({
        title: '線型VOI',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          // Set a range to highlight bones
          viewport.setProperties({
            VOILUTFunction: Enums.VOILUTFunctionType.LINEAR,
          });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: 'シグモイドVOI',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          // Set a range to highlight bones
          viewport.setProperties({
            VOILUTFunction: Enums.VOILUTFunctionType.SAMPLED_SIGMOID,
          });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: '拡大・縮小（ランダム）',
        container,
        idName,

        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

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
            focalPoint: focalPoint as Types.Point3,
            parallelScale,
            position: position as Types.Point3,
          };

          viewport.setCamera(newCamera);
          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: 'リセット',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          // Resets the viewport's camera
          viewport.resetCamera();
          // Resets the viewport's properties
          viewport.resetProperties();
          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: '白黒反転',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          const { invert } = viewport.getProperties();

          viewport.setProperties({ invert: !invert });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: '30°ずつの回転',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          const { rotation } = viewport.getProperties();
          console.log('rotation:', rotation);
          const newRotation = (rotation || 0) + 30;
          viewport.setProperties({ rotation: newRotation });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: '左右反転',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          const { flipHorizontal } = viewport.getCamera();
          viewport.setCamera({ flipHorizontal: !flipHorizontal });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
        title: '上下反転',
        container,
        idName,
        onClick: () => {
          // Get the rendering engine
          const renderingEngine = getRenderingEngine(renderingEngineId);

          // Get the stack viewport
          const viewport = renderingEngine?.getViewport(
            viewportId,
          ) as Types.IStackViewport;

          const { flipVertical } = viewport.getCamera();

          viewport.setCamera({ flipVertical: !flipVertical });

          viewport.render();
        },
      });

    container &&
      addButtonToToolbar({
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
      addButtonToToolbar({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
