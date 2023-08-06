export default function addButtonToToolbarBetauchi({
  title,
  container,
  idName,
  onClick,
}: {
  title: string;
  container: HTMLElement;
  idName: string;
  onClick: () => void;
}) {
  const button = document.createElement('button');

  button.id = idName || '';
  button.innerHTML = title;
  button.onclick = onClick;

  container && container.append(button);
}
