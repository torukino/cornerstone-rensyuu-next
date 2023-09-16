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
import { setMriTransferFunctionForVolumeActor } from '@/tools/cornerstoneTools';

const { ViewportType } = Enums;
// let renderingEngine: RenderingEngine | null = null;
// let volume: any;
export const runViewVolume = async (
  imageIds: string[],
  content: HTMLElement,
  element: HTMLDivElement,
  renderingEngineId: string,
  volumeId: string,
  viewportId: string,
  isVolume: boolean,
): Promise<void | undefined> => {
  cache.purgeCache();
  console.log('numboer of imageIds', imageIds.length);
  const renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;

  let viewport;
  let volume: Record<string, any>|undefined;
  if (isVolume) {
    // メモリー上でvolumeを定義する
    volume = await volumeLoader.createAndCacheVolume(
      volumeId,
      {
        imageIds,
      },
    );
    // volumeの起動(load)のセット
    await volume.load();
    const viewportInputForVolume = {
      defaultOptions: {
        background: <Types.Point3>[1.0, 0, 0],
        orientation: Enums.OrientationAxis.ACQUISITION,
      },
      element,
      type: ViewportType.PERSPECTIVE,
      viewportId,
    };
    renderingEngine.enableElement(viewportInputForVolume);
    //ビューポートにvolumeをセットする
    viewport = renderingEngine.getViewport(viewportId) as Types.IVolumeViewport
    await viewport.setVolumes([
      {
        callback: setMriTransferFunctionForVolumeActor,
        volumeId,
      },
    ]);
  } else {
    const viewportInputForStack = {
      element,
      type: ViewportType.STACK,
      viewportId,
    };
    renderingEngine.enableElement(viewportInputForStack);
    viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;
    await viewport.setStack(imageIds);
  }

  /**
   * ここからツールの設定
   */
  // ツール
  const toolGroup: cornerstoneTools.Types.IToolGroup | undefined =
    getToolGroupSetting(element);
  if (!toolGroup) return undefined;
  toolGroup.addViewport(viewportId, renderingEngineId);
  // 座標表示のためのツール
  volume && domCoordinates(content, element, viewport, volume);
  /**
   * ここまでツールの設定
   */
  // レンダリング
  viewport.render();
};
