import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';
import {
  AngleTool,
  annotation,
  ArrowAnnotateTool,
  BidirectionalTool,
  CircleROITool,
  CobbAngleTool,
  EllipticalROITool,
  LengthTool,
  PanTool,
  PlanarFreehandROITool,
  ProbeTool,
  RectangleROITool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

import ViewportType from '@/enums/cornerstone/ViewportType';
import {
  addButtonToToolbar,
  addDropdownToToolbar,
} from '@/tools/cornerstoneTools';

const { selection, state } = annotation;

const BUG = false;
let annotationUidNumber: number = 0;
export const addButtons = (
  element: HTMLDivElement,
  idName: string,
  imageIds: string[],
  renderingEngineId: string,
  viewportId: string,
) => {
  const { Events } = Enums;

  /**
   * カメラが変更されたときのイベントリスナーを追加します。
   * イベントが発生すると、レンダリングエンジンを取得し、
   * スタックビューポートを取得します。
   * レンダリングエンジンまたはビューポートが存在しない場合、
   * 処理は終了します。
   */
  element.addEventListener(Events.CAMERA_MODIFIED, (_) => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);
    if (!renderingEngine) return;
    // Get the stack viewport
    const viewport = renderingEngine.getViewport(
      viewportId,
    ) as Types.IStackViewport;

    if (!viewport) return;
  });

  // const defaultFrameOfReferemceSpecificAnnotationManager =
  //   annotation.state.getAnnotationManager();

  // 1. イベントリスナーの追加
  document.addEventListener('keydown', handleKeydown);
  element.addEventListener('contextmenu', handleRightClick);

  // 2. イベントハンドラの定義
  /**
   * キーボードイベントを処理する関数
   * 'Escape'または'Backspace'が押された場合、選択された注釈を削除します。
   * 'Space'が押された場合、注釈のUID番号を更新します。
   * @param {KeyboardEvent} e - 発生したキーボードイベント
   */
  function handleKeydown(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Delete') {
      deleteSelectedAnnotation();
    } else if (e.key === ' ' || e.key === '　') {
      console.log('space ------ ');
      let allAnnotations: cornerstoneTools.Types.Annotation[] = [];
      for (let toolName of toolsNames) {
        // TODO: ここでエラーがうまくいきません。getAnnotationsで落ちています. @torukino
        const annotationsList = state.getAnnotations(toolName, viewportId);
        allAnnotations = [...allAnnotations, ...annotationsList];
      }
      const size = allAnnotations.length;
      if (size > 0) {
        if ((annotationUidNumber = size)) annotationUidNumber = 0;
        else annotationUidNumber += 1;

        const annotation = allAnnotations[annotationUidNumber];
        if (annotation && annotation.annotationUID) {
          const annotationUID = annotation.annotationUID;
          console.log('annotationUID', annotationUID);
          selection.setAnnotationSelected(annotationUID, true, false);
        }
      }
    }
  }

  function handleRightClick(e: MouseEvent) {
    e.preventDefault();
    // 右クリックメニューを表示 (こちらは簡易的な実装です)
    const contextMenu = document.createElement('div');
    contextMenu.innerText = '注釈を削除';
    contextMenu.style.background = 'white';
    contextMenu.style.padding = '0px 4px';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    document.body.appendChild(contextMenu);

    contextMenu.addEventListener('click', () => {
      deleteSelectedAnnotation();
      document.body.removeChild(contextMenu);
    });

    // 他の場所をクリックしたときのメニューの削除
    document.addEventListener('click', () => {
      if (document.body.contains(contextMenu)) {
        document.body.removeChild(contextMenu);
      }
    });
  }

  /**
   * 選択された注釈を削除する関数
   * CornerstoneのAPIを使用して選択された注釈を削除します。
   * 実際の削除処理は、Cornerstoneの具体的なAPIや使用しているツールによって異なります。
   * そのため、具体的なコードはCornerstoneのドキュメントを参照してください。
   */
  function deleteSelectedAnnotation() {
    const annotationUIDs: string[] = selection.getAnnotationsSelected();
    if (annotationUIDs && annotationUIDs.length > 0) {
      const annotationUID = annotationUIDs[0];
      state.removeAnnotation(annotationUID);
    }
    viewport.render();
  }

  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;

  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  container.className =
    'w-[500px] mb-4 border border-solid border-gray-400 border-2';

  const toolGroupId = 'STACK_TOOL_GROUP_ID';
  const toolsNames = [
    WindowLevelTool.toolName,
    PlanarFreehandROITool.toolName,
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

  // Cornerstone3Dにツールを追加する
  if (!ToolGroupManager.getToolGroup(toolGroupId)) {
    cornerstoneTools.addTool(PlanarFreehandROITool);
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.addTool(ProbeTool);
    cornerstoneTools.addTool(RectangleROITool);
    cornerstoneTools.addTool(EllipticalROITool);
    cornerstoneTools.addTool(CircleROITool);
    cornerstoneTools.addTool(BidirectionalTool);
    cornerstoneTools.addTool(AngleTool);
    cornerstoneTools.addTool(CobbAngleTool);
    cornerstoneTools.addTool(ArrowAnnotateTool);
    // ツールグループにボタンなしのツールを追加する
    cornerstoneTools.addTool(WindowLevelTool);
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(ZoomTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
  }

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group

  ToolGroupManager.destroyToolGroup(toolGroupId); //
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;

  const instructions = document.createElement('p');
  instructions.innerText =
    '中クリック:移動\n右クリック：拡大縮小\nマウスホイール：スタックスクロール';
  // container.className = 'ml-4';
  container.append(instructions);

  // Add the tools to the tool group
  toolGroup.addTool(PlanarFreehandROITool.toolName);
  toolGroup.addTool(LengthTool.toolName);
  toolGroup.addTool(ProbeTool.toolName);
  toolGroup.addTool(RectangleROITool.toolName);
  toolGroup.addTool(EllipticalROITool.toolName);
  toolGroup.addTool(CircleROITool.toolName);
  toolGroup.addTool(BidirectionalTool.toolName);
  toolGroup.addTool(AngleTool.toolName);
  toolGroup.addTool(CobbAngleTool.toolName);
  toolGroup.addTool(ArrowAnnotateTool.toolName);
  // ツールグループにボタンなしのツールを追加する
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);

  // ツールの初期状態を設定する。ここでは、左クリック時にアクティブになるツールを1つ設定する。
  // これは左クリックでそのツールが描画されることを意味する。
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });

  // ツールの初期状態を設定する。
  toolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // 中央クリック
      },
    ],
  });
  toolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // 右クリック
      },
    ],
  });

  // スタックスクロールマウスホイールは、マウスボタンの代わりに `mouseWheelCallback` フックを使用するツールです。
  // フックを使用するツールであるため、マウスボタンを割り当てる必要はありません。
  toolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);
  // Instantiate a rendering engine

  //  TODO: ここは同じことではないか？？？なぜする必要があるのか。
  const renderingEngine = new RenderingEngine(renderingEngineId);
  // Create a stack viewport
  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[0.8, 0, 0.2],
    },
    element,
    type: ViewportType.STACK,
    viewportId,
  };
  renderingEngine.enableElement(viewportInput);

  // ビューポートにツールグループを設定する

  // TODO: ここだけ違う。作成したtoolGroupにviewportを設定している。
  toolGroup.addViewport(viewportId, renderingEngineId);

  // 作成されたスタックビューポートを取得
  const viewport = <Types.IStackViewport>(
    renderingEngine.getViewport(viewportId)
  );

  // 単一の画像を含むスタックを定義する
  const stack = imageIds;

  //ビューポートにスタックを設定する
  viewport.setStack(stack);

  //画像をレンダリングする
  viewport.render();

  // TODO: ここが機能していない。ちゃんと切り替わっていない
  addDropdownToToolbar({
    container,
    idName,
    onSelectedValueChange: (newSelectedToolNameAsStringOrNumber) => {
      const newSelectedToolName = String(newSelectedToolNameAsStringOrNumber);

      //新しいツールをアクティブにする
      // 前までのツールをenabledにして、選択したものをactiveにする
      toolGroup.setToolActive(newSelectedToolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Primary, // Left Click
          },
        ],
      });

      // Set the old tool passive
      toolGroup?.setToolPassive(selectedToolName);

      selectedToolName = newSelectedToolName as string;
    },
    options: { defaultValue: selectedToolName, values: toolsNames },
  });

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
        const NoOfImgs = imageIds[newImageIdIndex].split('/')[18].split('.');
        console.log(NoOfImgs[NoOfImgs.length - 1]);
        console.log(
          JSON.stringify(imageIds[newImageIdIndex].split('/'), null, 2),
        );
      }

      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });
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
        const NoOfImgs = imageIds[newImageIdIndex].split('/')[18].split('.');
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
