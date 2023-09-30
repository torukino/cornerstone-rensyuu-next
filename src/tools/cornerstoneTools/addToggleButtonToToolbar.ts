export default function addToggleButtonToToolbar({
  id,
  title,
  defaultToggle = false,
  onClick,
  toolbar,
}: {
  id?: string;
  title: string;
  defaultToggle?: boolean;
  onClick: (toggle: boolean) => void;
  toolbar: HTMLElement;
}) {
  const button = document.createElement('button');

  const toggleOnBackgroundColor = '#fcfba9';
  const toggleOffBackgroundColor = '#ffffff';

  let toggle = !!defaultToggle;

  function setBackgroundColor() {
    button.style.backgroundColor = toggle
      ? toggleOnBackgroundColor
      : toggleOffBackgroundColor;
  }

  setBackgroundColor();

  button.id = id || '';
  button.innerHTML = title;
  button.onclick = () => {
    toggle = !toggle;
    setBackgroundColor();
    onClick(toggle);
  };

  toolbar.append(button);
}
