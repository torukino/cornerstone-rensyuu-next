import { Types } from '@cornerstonejs/core';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getBaseViewport } from '@/components/cornerstone3d/rensyuuTools/getViewport';
import { globalLabelmapSegmentationConfiguration } from '@/components/cornerstone3d/rensyuuTools/globalLabelmapSegmentationConfiguration';
import { mouseCoordinate } from '@/components/cornerstone3d/rensyuuTools/mouseCoordinate';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo } from '@/tools/cornerstoneTools';

export const runSegment = async (
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

  const element: HTMLDivElement = getElement();
  content.appendChild(element);

  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = idName + '-MRI_STACK';

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();

  const viewport: Types.IStackViewport = await getBaseViewport(
    imageIds,
    element,
    renderingEngineId,
    viewportId,
  );

  mouseCoordinate(content, element, viewport);
  // setToolGroups(content, toolGroupId, viewportId);
  globalLabelmapSegmentationConfiguration(
    element,
    idName,
    renderingEngineId,
    viewportId,
    SeriesInstanceUID,
    StudyInstanceUID,
    DerivativeDiscription,
  );

  // Render the image
  viewport.render();
};
