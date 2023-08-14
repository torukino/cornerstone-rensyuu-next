'use client';
import {
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
  addDropdownToToolbar,
  initDemo,
} from '@/tools/cornerstoneTools';

const {
  AngleTool,
  ArrowAnnotateTool,
  BidirectionalTool,
  CircleROITool,
  CobbAngleTool,
  EllipticalROITool,
  Enums: csToolsEnums,
  LengthTool,
  PanTool,
  PlanarFreehandROITool,
  ProbeTool,
  RectangleROITool,
  StackScrollMouseWheelTool,
  StackScrollTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasicBetauchiToru: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'stackBasicBetauchi';
  const { MouseBindings } = csToolsEnums;

  const run = async (
    idName: string,
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
  ): Promise<void> => {
    const gcp = true;
    await initDemo(gcp);
    const content = document.getElementById(idName + '-content');
    const element = document.createElement('div');

    // Disable right click context menu so we can have right click tools
    element.oncontextmenu = (e) => e.preventDefault();
    // これにより、右クリックメニューが表示されなくなります。

    element.id = idName + 'cornerstone-element';
    element.style.width = '500px';
    element.style.height = '500px';
    content?.appendChild(element);

    /**
     * packages/tools/examples/stackAnnotationTools
     * スタックの注釈ツール
     * ここから
     */
    const toolGroupIdAnnotation = 'STACK_TOOL_GROUP_ID';
    const toolsNames = [
      LengthTool.toolName,
      ProbeTool.toolName,
      RectangleROITool.toolName,
      EllipticalROITool.toolName,
      CircleROITool.toolName,
      BidirectionalTool.toolName,
      AngleTool.toolName,
      CobbAngleTool.toolName,
      ArrowAnnotateTool.toolName,
    ];
    let selectedToolName = toolsNames[0];


    //　注釈ツール　ここまで
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

    // 操作ツールの設定　ここから
    const toolGroupId = 'STACK_TOOL_GROUP_ID';
    const leftClickTools = [WindowLevelTool.toolName];
    const defaultLeftClickTool = leftClickTools[0];
    let currentLeftClickTool = leftClickTools[0];
    const instructions = document.createElement('p');
    instructions.innerText =
      '中クリック:移動\n右クリック：拡大縮小\nマウスホイール：スタックスクロール';
    content?.append(instructions);

    const instructions2 = document.createElement('p');
    instructions2.innerText = `
ドローイング：

- 左クリック＆ドラッグで輪郭を描く。
-- マウスを離すと開いた輪郭（フリーハンドの線）になります。

編集：
- 既存の輪郭線を左クリックしたままドラッグすると編集できます：
-- 閉じた輪郭：
--- 線をドラッグすると、編集のプレビューが表示されます。マウスを離すと編集が完了します。1回のドラッグで元の輪郭を複数回横切ることができ、1回の動作で複雑な編集を行うことができます。
-- 輪郭を開く
--- このハンドルをドラッグすると、ポリラインをさらに引き出すことができます。このハンドルをドラッグすると、ポリラインがさらに引き出されます。輪郭を閉じたい場合は、このハンドルをもう一方の端に戻すことができます。
--- 線をドラッグすると、編集のプレビューが表示されます。マウスを離すと編集が完了します。一度のドラッグで元の輪郭を複数回横切ることができ、複雑な編集を一度に行うことができます。
--- 開いた輪郭の終端を越えて線をドラッグすると、編集がスナップして新しい終端となり、描画を続けることができます。

オープンアノテーションを設定して、端点を結合し、中間点から輪郭までの最長ラインを描く（心臓ワークフローなどで馬蹄形の輪郭を描く場合）（将来的には、これは独自のツールに引き出される可能性が高い）：
- 開いた輪郭を馬蹄形として描く。
- 開いた輪郭を選択した状態で、'両端と中点が線で結ばれた、選択された開いた輪郭をレンダリングする'ボタンをクリックします。
- 両端が点線で描かれ、馬蹄の先端までの中点が計算されて表示されます。
`;

    content?.append(instructions2);

    // Add tools to Cornerstone3D
    // cornerstoneTools.addTool(PanTool);
    // cornerstoneTools.addTool(WindowLevelTool);
    // cornerstoneTools.addTool(StackScrollMouseWheelTool);
    // cornerstoneTools.addTool(ZoomTool);

    if (!ToolGroupManager.getToolGroup(toolGroupId)) {
      cornerstoneTools.addTool(PanTool);
      cornerstoneTools.addTool(WindowLevelTool);
      cornerstoneTools.addTool(StackScrollMouseWheelTool);
      cornerstoneTools.addTool(ZoomTool);
      cornerstoneTools.addTool(PlanarFreehandROITool);
    }

    // ツールグループを定義し、
    // マウスイベントが以下のツールコマンドにどのようにマッピングされるかを定義します。
    // グループを使用するすべてのビューポート
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // Add tools to the tool group
    toolGroup?.addTool(WindowLevelTool.toolName);
    toolGroup?.addTool(PanTool.toolName);
    toolGroup?.addTool(ZoomTool.toolName);
    toolGroup?.addTool(StackScrollMouseWheelTool.toolName, {
      loop: true,
    });
    toolGroup?.addTool(PlanarFreehandROITool.toolName, {
      cachedStats: true,
    });

    // ツールの初期状態を設定する。ここでは、すべてのツールがアクティブで、以下の状態にバインドされている。
    // 異なるマウス入力
    // toolGroup?.setToolActive(PlanarFreehandROITool.toolName, {
    //   bindings: [
    //     {
    //       mouseButton: MouseBindings.Primary, // Left Click
    //     },
    //   ],
    // });
    // toolGroup?.setToolActive(defaultLeftClickTool, {
    //   bindings: [
    //     {
    //       mouseButton: MouseBindings.Primary, // 左クリック
    //     },
    //   ],
    // });
    toolGroup?.setToolActive(cornerstoneTools.PanTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Auxiliary, // 中央クリック
        },
      ],
    });
    toolGroup?.setToolActive(cornerstoneTools.ZoomTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Secondary, // 右クリック
        },
      ],
    });
    // スタックスクロールマウスホイールは、マウスボタンの代わりに `mouseWheelCallback` フックを使用するツールです。
    // フックを使用するツールであるため、マウスボタンを割り当てる必要はありません。
    toolGroup?.setToolActive(
      cornerstoneTools.StackScrollMouseWheelTool.toolName,
    );
    //　操作ツールの設定　ここまで

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

    // ビューポートにツールグループを設定する
    toolGroup?.addViewport(viewportId, renderingEngineId);

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

    const container = document.getElementById(`${idName}-toolbar`);
    container &&
      addDropdownToToolbar({
        container,
        idName,
        onSelectedValueChange: (newSelectedToolNameAsStringOrNumber) => {
          const newSelectedToolName = String(
            newSelectedToolNameAsStringOrNumber,
          );
          const toolGroup = ToolGroupManager.getToolGroup(
            toolGroupIdAnnotation,
          );

          //新しいツールをアクティブにする
          toolGroup?.setToolActive(newSelectedToolName, {
            bindings: [
              {
                mouseButton: MouseBindings.Primary, // Left Click
              },
            ],
          });

          // Set the old tool passive
          // toolGroup?.setToolPassive(selectedToolName);

          selectedToolName = newSelectedToolName as string;
        },
        options: { defaultValue: selectedToolName, values: toolsNames },
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

          // Increment the index, clamping to the first image if necessary
          let newImageIdIndex = currentImageIdIndex + 1;

          newImageIdIndex = Math.min(newImageIdIndex, imageIds.length - 1);
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
        id={`${idName}-toolbarAnnotation`}
        className="justify-between text-purple-500"
      ></div>
      <div
        id={`${idName}-content`}
        className="h-[800px] w-[400px] items-center"
      ></div>
    </div>
  );
};

export default StackBasicBetauchiToru;
