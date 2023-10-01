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
    // Volume表示
    // メモリー上でvolumeを定義する
    const volume = await volumeLoader.createAndCacheVolume(volumeId, {
      imageIds,
    });

    /**
     * ここからツールの設定
     */

    const toolGroupId = 'TOOL_GROUP_ID';
    // ツールグループが存在する場合、それを破壊します
    if (toolGroup)
      cornerstoneTools.ToolGroupManager.destroyToolGroup(toolGroupId);
    // 新しいツールグループを作成します
    toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);
    // ツールグループが作成されなかった場合、関数を終了します
    if (!toolGroup) return;
    const toolbar = document.getElementById(`${idName}-toolbar`);
    if (!toolbar) return;

    const segmentationId = 'segmentation_brush_scissors' + Date.now();
    // Create a segmentation of the same resolution as the source data
    // using volumeLoader.createAndCacheDerivedVolume.
    const volumeSegmentation = await volumeLoader.createAndCacheDerivedVolume(
      volumeId,
      {
        volumeId: segmentationId,
      },
    );
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
    );

    // ボタン　ツール設定
    await setToolButtons(idName, toolbar, renderingEngineId, viewportId);
    //　イベントハンドラーの設定　wheelページめくりの際のページ番号の取得など
    setEventHandlers(renderingEngineId, viewportId, imageIds, element);
    // 座標表示のためのツール
    volumeSegmentation &&
      volume &&
      domCoordinates(
        coordinates,
        element,
        viewport,
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
