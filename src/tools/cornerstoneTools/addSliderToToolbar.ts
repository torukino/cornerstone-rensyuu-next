export default function addSliderToToolbar({
  id,
  title,
  defaultValue,
  idName,
  onSelectedValueChange,
  range,
  step,
  toolbar,
  updateLabelOnChange,
}: {
  id?: string;
  title: string;
  defaultValue: number;
  idName: string;
  onSelectedValueChange: (value: string) => void;
  range: number[];
  step?: number;
  toolbar?: HTMLElement;
  updateLabelOnChange?: (value: string, label: HTMLElement) => void;
}) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (id) {
    input.id = id;
    label.id = `${id}-label`;
  }

  label.htmlFor = title;
  label.innerText = title;

  input.type = 'range';
  input.min = String(range[0]);
  input.max = String(range[1]);
  input.value = String(defaultValue);
  input.name = title;
  // add step
  if (step) {
    input.step = String(step);
  }

  input.oninput = (evt) => {
    const selectElement = <HTMLSelectElement>evt.target;

    if (selectElement) {
      onSelectedValueChange(selectElement.value);
      if (updateLabelOnChange !== undefined) {
        updateLabelOnChange(selectElement.value, label);
      }
    }
  };
  if (!toolbar) {
    toolbar = document.getElementById(idName + '-toolbar') || undefined;
  }
  toolbar?.append(label);
  toolbar?.append(input);
}
