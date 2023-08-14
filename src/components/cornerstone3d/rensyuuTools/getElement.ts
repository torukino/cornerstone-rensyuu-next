export const getElement = (): HTMLDivElement => {
  const element: HTMLDivElement = document.createElement('div');
  // Disable right click context menu so we can have right click tools
  // element.oncontextmenu = (e) => e.preventDefault();
  // これにより、右クリックメニューが表示されなくなります。
  element.id = 'cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';
  return element;
};
