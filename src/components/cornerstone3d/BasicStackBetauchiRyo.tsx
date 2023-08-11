'use client';
import { RenderingEngine, Types } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import React, { useEffect } from 'react';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import ViewportType from '@/enums/cornerstone/ViewportType';
import { initDemo } from '@/tools/cornerstoneTools';

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

const StackBasicBetauchiRyo: React.FC<PROPS> = ({
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

    // マウスの座標を取得するためのHTML要素を作成　ここから
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
    canvasPosElement.className = 'text-xl text-purple-800';
    worldPosElement.className = 'text-xl text-purple-800 mb-10';
    // マウスの座標を取得するためのHTML要素を作成　ここまで

    const gcp = true;
    await initDemo(gcp);

    // コーナーストーンのimageIdsを取得し、メタデータをRAMに取り込む
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );
    imageIds.sort();
    //レンダリング・エンジンをインスタンス化する
    const renderingEngineId = idName + '-RenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);
    // スタックビューポートの作成
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
    // スタックビューポートを取得します。
    const viewport = renderingEngine.getViewport(
      viewportId,
    ) as Types.IStackViewport;
    // すべての画像を含むスタックを定義する
    const stack = imageIds;
    // ビューポートにスタックを設定する
    await viewport.setStack(stack);
    viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });
    // Render the image
    viewport.render();
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

export default StackBasicBetauchiRyo;
