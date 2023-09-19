import { Enums, RenderingEngine, Types } from '@cornerstonejs/core';

const { ViewportType } = Enums;
// let renderingEngine: RenderingEngine | null = null;
// let volume: any;
export const runViewStackMini = async (
  imageIds: string[],
  element: HTMLDivElement,
  viewportId: string,
  renderingEngine: RenderingEngine,
): Promise<void | undefined> => {

  const viewportInput = {
    element,
    type: ViewportType.STACK,
    viewportId,
  };

  renderingEngine.enableElement(viewportInput);

  const viewport = renderingEngine.getViewport(
    viewportId,
  ) as Types.IStackViewport;

  const imageNum: number = imageIds.length;
  const n = Math.floor(imageNum / 2);
  await viewport.setStack(imageIds, n);
  
  // レンダリング
  viewport.render();
};
