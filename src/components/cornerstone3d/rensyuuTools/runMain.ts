import { Types } from '@cornerstonejs/core';

import { addButtons } from '@/components/cornerstone3d/rensyuuTools/addButtons';
import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { getBaseViewport } from '@/components/cornerstone3d/rensyuuTools/getViewport';
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

  const viewport: Types.IStackViewport = await getBaseViewport(
    imageIds,
    element,
    renderingEngineId,
    viewportId,
  );

  mouseCoordinate(content, element, viewport);
  // setToolGroups(content, toolGroupId, viewportId);

  addButtons(element, idName, imageIds, renderingEngineId, viewportId);

  // Render the image
  viewport.render();
};
