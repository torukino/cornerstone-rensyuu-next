export default function setTitleAndDescription(id, titleText, descriptionText) {
  const title = document.getElementById(id + '-title');
  const description = document.getElementById(id + '-description');

  title.innerText = titleText;
  description.innerText = descriptionText;
}
