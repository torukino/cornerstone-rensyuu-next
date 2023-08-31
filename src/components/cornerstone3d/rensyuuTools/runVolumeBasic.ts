import {
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
let renderingEngine: RenderingEngine | null = null;
export const runVolumeBasic = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const viewportId = idName + '-MRI-volume';
  if (renderingEngine) renderingEngine.disableElement(viewportId);

  const gcp = true;
  await initDemo(gcp);

  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  const element: HTMLDivElement = getElement();
  content.appendChild(element);

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
  // 新しいRenderingEngineインスタンスを作成する前に、既存のインスタンスがあれば破棄する

  const renderingEngineId = idName + '-RenderingEngine';

  renderingEngine = new RenderingEngine(renderingEngineId);
  if (!renderingEngine) return;

  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
      orientation: Enums.OrientationAxis.SAGITTAL,
    },
    element,
    type: ViewportType.ORTHOGRAPHIC,
    viewportId,
  };

  renderingEngine.enableElement(viewportInput);
  console.log(renderingEngine);
  const viewport = <Types.IVolumeViewport>(
    renderingEngine.getViewport(viewportId)
  );

  const volumeName = 'MRI-volume-id';
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
  const volumeId = `${volumeLoaderScheme}:${volumeName}`;

  // メモリー上でvolumeを定義する
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // volumeの起動(load)のセット
  volume.load();

  //ビューポートにvolumeをセットする
  viewport.setVolumes([
    {
      callback: setMriTransferFunctionForVolumeActor,
      volumeId,
    },
  ]);

  // Render the image
  viewport.render();
};
