import {
  cache,
  Enums,
  RenderingEngine,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  initDemo,
  setMriTransferFunctionForVolumeActor,
} from '@/tools/cornerstoneTools';

const { ViewportType } = Enums;
// let renderingEngine: RenderingEngine | null = null;
let volume: any;
export const runVolumeBasic = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<Types.IVolumeViewport | undefined> => {
  // if(volumeLoader)  cancelLoadAll();

  const gcp = true;
  await initDemo(gcp);

  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return undefined;

  const element: HTMLDivElement = getElement(idName);
  content.appendChild(element);
  console.log('runVolumeBasic element', element);

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();
  /**
   * RenderingEngineは、ビューポートを作成し、
   * それらをオフスクリーンの大きなキャンバスにレンダリングし、
   * このデータをスクリーンに戻すという完全なパイプラインを担当します。
   * これにより、vtk.js のパワーを活用しながら、
   * 処理に WebGL コンテキストを 1 つだけ使用し、
   * 同じデータを表示する画面上のビューポート間でテクスチャメモリを共有することができます。
   */

  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = idName + '-MRI-volume';
  // 新しいRenderingEngineインスタンスを作成する前に、既存のインスタンスがあれば破棄する
  // if (renderingEngine) renderingEngine.disableElement(viewportId);
  const renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;

  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
      orientation: Enums.OrientationAxis.ACQUISITION,
    },
    element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId,
  };

  renderingEngine.enableElement(viewportInput);
  // console.log(renderingEngine);

  const volumeName = 'MRI-volume-id';
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
  const volumeId = `${volumeLoaderScheme}:${volumeName}`;

  // メモリー上でvolumeを定義する
  cache.purgeCache();

  console.log('@@@@ imageIds[0] @@@@@@', imageIds[0]);
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });
  // volumeの起動(load)のセット
  await volume.load();
  const value = volume._imageIdsIndexMap.get(imageIds[0]);
  console.log('@@@@ volume value @@@@@@', value);
  console.log('@@@@ volume 2 @@@@@@', Object.keys(volume));
  const key = getKeyByValue(volume._imageIdsIndexMap, value);
  console.log('volume3 [1] key', key);

  // ビューポートを取得する
  // console.log(
  //   '@@@@ renderingEngine.getViewport(viewportId) @@@@@@',
  //   renderingEngine.getViewport(viewportId),
  // );
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );
  //ビューポートにvolumeをセットする
  await viewport.setVolumes([
    {
      callback: setMriTransferFunctionForVolumeActor,
      volumeId,
    },
  ]);

  return viewport;
  // 画像をレンダリングする
  // viewport.render();
};

function getKeyByValue(map: any, searchValue: any) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) {
      return key;
    }
  }
}
