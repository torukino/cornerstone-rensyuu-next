import {
  cache,
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { domCoordinates } from '@/components/cornerstone3d/rensyuuTools/tools/domCoordinates';
import { getToolGroupSetting } from '@/components/cornerstone3d/rensyuuTools/tools/getToolGroupSetting';
import { setEventHandlers } from '@/components/cornerstone3d/rensyuuTools/tools/setEventHandlers';
import { setToolButtons } from '@/components/cornerstone3d/rensyuuTools/tools/setToolButtons';
import { setMriTransferFunctionForVolumeActor } from '@/tools/cornerstoneTools';

const { ViewportType } = Enums;

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
    // Volume表示
    // メモリー上でvolumeを定義する
    const volume = await volumeLoader.createAndCacheVolume(volumeId, {
      imageIds,
    });
    // volumeの起動(load)のセット

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

    await volume.load();

    // Set the volume on the viewport
    viewport.setVolumes([
      { callback: setMriTransferFunctionForVolumeActor, volumeId },
    ]);

    /**
     * ここからツールの設定
     */
    // マウス操作ツール

    const toolGroup: cornerstoneTools.Types.IToolGroup | undefined =
      getToolGroupSetting(element);
    if (!toolGroup) return undefined;
    toolGroup.addViewport(viewportId, renderingEngineId);

    // ツールボタン
    const toolbar = document.getElementById(`${idName}-toolbar`);
    if (!toolbar) return;
    await setToolButtons(idName, toolbar, renderingEngineId, viewportId);

    // 座標表示のためのツール
    volume && domCoordinates(coordinates, element, viewport, volume);

    //　イベントハンドラーの設定
    // setEventHandlers(renderingEngineId, viewportId, imageIds, element);

    /**
     * ツールの設定 ここまで
     */
    // Render the image
    viewport.render();
  } else {
    // Stack 表示
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

    //　イベントハンドラーの設定
    setEventHandlers(renderingEngineId, viewportId, imageIds, element);

    viewport.render();
  }
};
