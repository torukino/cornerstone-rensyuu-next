export default function addButtonToToolbar({
  title,
  idName,
  onClick,
  toolbar,
}: {
  title: string;
  idName: string;
  onClick: () => void;
  toolbar: HTMLElement;
}) {
  const button = document.createElement('button');
  button.className =
    'font-bold border-blue-700 bg-blue-500 text-white py-1 px-2 m-2 transition-colors duration-200 ease-in-out hover:bg-opacity-75 hover:border-blue-700';

  button.id = idName || '';
  button.innerHTML = title;
  button.onclick = onClick;

  toolbar.append(button);
}
