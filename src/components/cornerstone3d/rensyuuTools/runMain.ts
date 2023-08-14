import { RenderingEngine, Types } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { mouseCoordinate } from '@/components/cornerstone3d/rensyuuTools/mouseCoordinate';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo } from '@/tools/cornerstoneTools';

export const runMain = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const gcp = true;
  await initDemo(gcp);
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  const element: HTMLDivElement = getElement();
  content.appendChild(element);

  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = ' MRI_STACK';
  const toolGroupId = 'MRI_TOOL_GROUP';

  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  // const viewport: Types.IStackViewport = await getBaseViewport(
  //   imageIds,
  //   element,
  //   renderingEngineId,
  //   viewportId,
  // );

  //レンダリング・エンジンをインスタンス化する
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // スタックビューポートの作成
  const viewportInput = {
    defaultOptions: {
      background: [0.8, 0.0, 0.2] as Types.Point3, // 背景色
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
  viewport.setProperties({ voiRange: { lower: 0, upper: 2000 } });

  mouseCoordinate(content, element, viewport);
  // setToolGroups(toolGroupId, viewportId);
  // const instructions = document.createElement('p');
  // instructions.innerText =
  //   '中クリック:移動\n右クリック：拡大縮小\nマウスホイール：スタックスクロール';
  // content.append(instructions);
  // addButtons(idName, imageIds, renderingEngineId, viewportId);

  // Render the image
  viewport.render();
};
