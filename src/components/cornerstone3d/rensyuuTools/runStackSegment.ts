import { RenderingEngine, Types } from '@cornerstonejs/core';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import ViewportType from '@/enums/cornerstone/ViewportType';
import { initDemo } from '@/tools/cornerstoneTools';

export const runStackSegment = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  const gcp = true;
  await initDemo(gcp);

  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  const element: HTMLDivElement = getElement(idName);
  content.appendChild(element);

  const viewportId = idName + '-MRI_STACK';

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  console.log('element:', element);

  const viewportInput = {
    defaultOptions: {
      background: <Types.Point3>[0.2, 0, 0.2],
    },
    element,
    type: ViewportType.STACK,
    viewportId,
  };

  // Instantiate a rendering engine
  const renderingEngineId = idName + '-myRenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);
  renderingEngine.enableElement(viewportInput);

  // Get the stack viewport that was created
  const viewport = <Types.IStackViewport>(
    renderingEngine.getViewport(viewportId)
  );

  // Define a stack containing a single image
  const stack = [imageIds[0]];

  // Set the stack on the viewport
  await viewport.setStack(stack);

  // Set the VOI of the stack
  viewport.setProperties({ voiRange: { lower: 0, upper: 2500 } });
  // Render the image
  viewport.render();
};
