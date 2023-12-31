import { RenderingEngine, Types } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

export const getBaseViewport = (
  imageIds: string[],
  element: HTMLDivElement,
  renderingEngineId: string,
  viewportId: string,
): Types.IStackViewport => {
  //レンダリング・エンジンをインスタンス化する
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // スタックビューポートの作成
  const viewportInput = {
    // TODO: 多分ここら辺で生データについての情報をいじることができるのではないか？
    defaultOptions: {
      background: [0.0, 0.0, 0.0] as Types.Point3, // 背景色
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
  viewport.setStack(stack);
  
  // MR用に設定している。CT用だったら lowerが-1500（？）からになる（サンプル参照）
  viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });
  return viewport;
};
