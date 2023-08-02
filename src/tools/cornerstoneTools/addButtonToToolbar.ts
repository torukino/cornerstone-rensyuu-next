export default function addButtonToToolbar({
  title,
  container,
  idName,
  onClick,
}: {
  title: string;
  container?: HTMLElement;
  idName: string;
  onClick: () => void;
}) {
  const button = document.createElement('button');

  button.id = idName || '';
  button.innerHTML = title;
  button.onclick = onClick;

  if (!container) {
    container = document.getElementById(idName + '-toolbar') || undefined;
  }

  container?.append(button);
}
