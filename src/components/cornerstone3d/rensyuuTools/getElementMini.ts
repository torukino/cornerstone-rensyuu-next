export const getElementMini = (idName: string): HTMLDivElement => {
  const element: HTMLDivElement = document.createElement('div');
  // Disable right click context menu so we can have right click tools
  // element.oncontextmenu = (e) => e.preventDefault();
  // これにより、右クリックメニューが表示されなくなります。
  element.id = idName + 'cornerstone-element';
  element.style.width = '100px';
  element.style.height = '100px';
  return element;
};
