import {
  cache,
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';

import { setMriTransferFunctionForVolumeActor } from '@/tools/cornerstoneTools';

const { ViewportType } = Enums;
// let renderingEngine: RenderingEngine | null = null;
let volume: any;
export const runViewVolume = async (
  imageIds: string[],
  element: HTMLDivElement,
  renderingEngineId: string,
  volumeId: string,
  viewportId: string,
): Promise<void> => {
  cache.purgeCache();

  const renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
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
  // console.log(renderingEngine);

  // メモリー上でvolumeを定義する
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });
  // volumeの起動(load)のセット
  await volume.load();

  //ビューポートにvolumeをセットする
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );
  await viewport.setVolumes([
    {
      callback: setMriTransferFunctionForVolumeActor,
      volumeId,
    },
  ]);

  viewport.render();
};
