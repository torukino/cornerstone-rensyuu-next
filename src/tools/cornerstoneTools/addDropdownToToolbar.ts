export default function addDropDownToToolbar({
  id,
  idName,
  onSelectedValueChange,
  options,
  toolbar,
}: {
  id?: string;
  idName: string;
  onSelectedValueChange: (value: number | string) => void;
  options: { defaultValue: number | string; values: number[] | string[] };
  toolbar: HTMLElement;
}) {
  const { defaultValue, values } = options;
  const select = document.createElement('select');
  select.className =
    'font-bold border-blue-700 bg-blue-500 text-white py-1 px-2 m-2 transition-colors duration-200 ease-in-out hover:bg-opacity-75 hover:border-purple-700';

  select.id = id || '';

  values.forEach((value) => {
    const optionElement = document.createElement('option');

    optionElement.value = String(value);
    optionElement.innerText = JapaneseText(String(value));

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

  toolbar.append(select);
}

const JapaneseText = (value: string): string => {
  const mapping = {
    Angle: '角度',
    ArrowAnnotate: '矢印注釈',
    Bidirectional: '両矢印',
    CircleROI: '円',
    CircleScissor: '円ハサミ',
    CircularBrush: '円ブラシ',
    CircularEraser: '円消しゴム',
    CobbAngle: 'コブ角',
    EllipticalROI: '楕円',
    Length: '長さ',
    PaintFill: '全塗り',
    PlanarFreehandROI: '自由曲線',
    Probe: 'マーカー',
    RectangleROI: '矩形',
    RectangleScissor: '矩形ハサミ​',
    SphereBrush: '球ブラシ',
    SphereEraser: '消しゴム球',
    SphereScissor: '球ハサミ',
    ThresholdBrush: '閾値ブラシ',
    WindowLevel: 'コントラスト',
  };

  return mapping[value as keyof typeof mapping] || value;
};
