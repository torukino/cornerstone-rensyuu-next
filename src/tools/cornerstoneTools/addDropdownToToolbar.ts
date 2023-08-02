export default function addDropDownToToolbar({
  id,
  container,
  idName,
  onSelectedValueChange,
  options,
}: {
  id?: string;
  container?: HTMLElement;
  idName: string;
  onSelectedValueChange: (value: number | string) => void;
  options: { defaultValue: number | string; values: number[] | string[] };
}) {
  const { defaultValue, values } = options;
  const select = document.createElement('select');

  select.id = id || '';

  values.forEach((value) => {
    const optionElement = document.createElement('option');

    optionElement.value = String(value);
    optionElement.innerText = String(value);

    if (value === defaultValue) {
      optionElement.selected = true;
    }

    select.append(optionElement);
  });

  select.onchange = (evt) => {
    const selectElement = <HTMLSelectElement>evt.target;

    if (selectElement) {
      onSelectedValueChange(selectElement.value);
    }
  };

  if (!container) {
    container = document.getElementById(idName + '-toolbar') || undefined;
  }

  container?.append(select);
}
