import {
  cache,
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { domCoordinates } from '@/components/cornerstone3d/rensyuuTools/tools/domCoordinates';
import { getSegmentToolGroupSetting } from '@/components/cornerstone3d/rensyuuTools/tools/getToolGroupSetting';
import { setEventHandlers } from '@/components/cornerstone3d/rensyuuTools/tools/setEventHandlers';
import { setMouseTools } from '@/components/cornerstone3d/rensyuuTools/tools/setMouseTools';
import { setToolButtons } from '@/components/cornerstone3d/rensyuuTools/tools/setToolButtons';
import { setMriTransferFunctionForVolumeActor } from '@/tools/cornerstoneTools';

const { ViewportType } = Enums;
let toolGroup: cornerstoneTools.Types.IToolGroup | undefined;

export const runViewVolume = async (
  idName: string,
  imageIds: string[],
  coordinates: HTMLElement,
  element: HTMLDivElement,
  volumeId: string,
  viewportId: string,
  isVolume: boolean,
): Promise<void | undefined> => {
  cache.purgeCache();
  const renderingEngineId = 'RenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;

  if (isVolume) {
    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[1.0, 0, 0],
        orientation: Enums.OrientationAxis.ACQUISITION,
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

    /**
     * Volumeの作成
     */
    const volume = await volumeLoader.createAndCacheVolume(volumeId, {
      imageIds,
    });
    // Create a segmentation of the same resolution as the source data
    // using volumeLoader.createAndCacheDerivedVolume.
    const segmentationId = 'segmentation_id' + Date.now();
    const volumeSegmentation = await volumeLoader.createAndCacheDerivedVolume(
      volumeId,
      {
        volumeId: segmentationId,
      },
    );

    /**
     * 使うツールの宣言
     */
    cornerstoneTools.removeTool(cornerstoneTools.StackScrollMouseWheelTool);

    cornerstoneTools.removeTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);

    cornerstoneTools.removeTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);

    cornerstoneTools.removeTool(cornerstoneTools.WindowLevelTool);
    cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);

    cornerstoneTools.removeTool(cornerstoneTools.RectangleScissorsTool);
    cornerstoneTools.addTool(cornerstoneTools.RectangleScissorsTool);

    cornerstoneTools.removeTool(cornerstoneTools.CircleScissorsTool);
    cornerstoneTools.addTool(cornerstoneTools.CircleScissorsTool);

    cornerstoneTools.removeTool(cornerstoneTools.SphereScissorsTool);
    cornerstoneTools.addTool(cornerstoneTools.SphereScissorsTool);

    cornerstoneTools.removeTool(cornerstoneTools.PaintFillTool);
    cornerstoneTools.addTool(cornerstoneTools.PaintFillTool);

    cornerstoneTools.removeTool(cornerstoneTools.BrushTool);
    cornerstoneTools.addTool(cornerstoneTools.BrushTool);

    // Add tools to Cornerstone3D

    const toolGroupId = 'TOOL_GROUP_ID';
    // ツールグループが存在する場合、それを破壊します
    if (toolGroup)
      cornerstoneTools.ToolGroupManager.destroyToolGroup(toolGroupId);
    // 新しいツールグループを作成します
    toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);
    // ツールグループが作成されなかった場合、関数を終了します
    if (!toolGroup) return;

    toolGroup.addTool(cornerstoneTools.SegmentationDisplayTool.toolName);
    toolGroup.setToolEnabled(cornerstoneTools.SegmentationDisplayTool.toolName);

    // Segmentation Tools
    toolGroup.addTool(cornerstoneTools.RectangleScissorsTool.toolName);
    toolGroup.addTool(cornerstoneTools.CircleScissorsTool.toolName);
    toolGroup.addTool(cornerstoneTools.SphereScissorsTool.toolName);
    toolGroup.addTool(cornerstoneTools.PaintFillTool.toolName);
    toolGroup.addTool(cornerstoneTools.BrushTool.toolName);

    //ツールバーDOMの取得
    const toolbar = document.getElementById(`${idName}-toolbar`);
    if (!toolbar) return;

    // マウス操作 tools
    setMouseTools(toolGroupId, element);
    // Segmentツール
    await getSegmentToolGroupSetting(
      idName,
      toolbar,
      element,
      volumeId,
      toolGroupId,
      renderingEngineId,
      viewportId,
      segmentationId,
      volumeSegmentation,
    );

    // ボタン　ツール設定
    await setToolButtons(idName, toolbar, renderingEngineId, viewportId);
    //　イベントハンドラーの設定　wheelページめくりの際のページ番号の取得など
    setEventHandlers(renderingEngineId, viewportId, imageIds, element);
    // 座標表示のためのツール

    domCoordinates(
      coordinates,
      element,
      viewport,
      volumeId,
      volume,
      volumeSegmentation,
      toolbar,
      idName,
    );

    /**
     * ツールの設定 ここまで
     */

    // volumeの起動(load)のセット
    toolGroup.addViewport(viewportId, renderingEngineId);
    await volume.load();

    // Set the volume on the viewport
    viewport.setVolumes([
      { callback: setMriTransferFunctionForVolumeActor, volumeId },
    ]);
    console.log('too;Group', toolGroup);
    // Render the image
    viewport.render();
  } else {
    // Stack 表示

    //　イベントハンドラーの設定
    setEventHandlers(renderingEngineId, viewportId, imageIds, element);

    const viewportInput = {
      element,
      type: ViewportType.STACK,
      viewportId,
    };
    renderingEngine.enableElement(viewportInput);
    const viewport = renderingEngine.getViewport(
      viewportId,
    ) as Types.IStackViewport;
    await viewport.setStack(imageIds);

    viewport.render();
  }
};
