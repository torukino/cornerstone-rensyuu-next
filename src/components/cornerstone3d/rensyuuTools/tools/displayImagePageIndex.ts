import { getRenderingEngine } from '@cornerstonejs/core';

export const displayImagePageIndex = async(
  renderingEngineId: string,
  viewportId: string,
  imageIds: string[],
  element: HTMLDivElement,
): Promise<void> => {
  // Get the rendering engine
  const renderingEngine = getRenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
  // Get the stack viewport
  const viewport = renderingEngine.getViewport(viewportId);
  // Get the current index of the image displayed
  const currentImageIdIndex = viewport.getCurrentImageIdIndex();
  
  console.log('currentImageIdIndex:', currentImageIdIndex);
  const oldDiv = document.getElementById('image-index-display');
  if (oldDiv) {
    element.removeChild(oldDiv);
  }
  // Create a new div element
  element.style.position = 'relative';

  // Create a new div element
  const newDiv = document.createElement('div');
  newDiv.id = 'image-index-display';
  newDiv.style.position = 'absolute';
  newDiv.style.left = '0';
  newDiv.style.bottom = '0';
  newDiv.style.background = 'white';
  newDiv.style.padding = '0px 4px';
  newDiv.style.fontSize = '20px';
  newDiv.style.fontWeight = 'bold';
  newDiv.style.backgroundColor = 'black';
  newDiv.style.color = 'white';
  newDiv.style.zIndex = '1000';

  // Set the text content
  newDiv.textContent = `${currentImageIdIndex + 1} / ${imageIds.length}`;

  // Append the new div to the element
  element.appendChild(newDiv);
};
