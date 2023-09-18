import { getRenderingEngine, Types } from '@cornerstonejs/core';

import addButtonToToolbar from '@/components/cornerstone3d/rensyuuTools/tools/addButtonToToolbar';

export const setToolButtons = (
  idName: string,
  toolbar: HTMLElement,
  renderingEngineId: string,
  viewportId: string,
) => {
  addButtonToToolbar({
    title: '画像を元に戻す',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
      if (!renderingEngine) return;
      // Get the volume viewport
      const viewport = <Types.IVolumeViewport>(
        renderingEngine.getViewport(viewportId)
      );

      // Resets the viewport's camera
      viewport.resetCamera();
      // TODO reset the viewport properties, we don't have API for this.

      viewport.render();
    },
    toolbar,
  });
};
