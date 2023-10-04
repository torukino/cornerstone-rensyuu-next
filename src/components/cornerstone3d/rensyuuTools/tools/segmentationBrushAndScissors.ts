import { Types } from '@cornerstonejs/core';
import {
  BrushTool,
  CircleScissorsTool,
  PaintFillTool,
  RectangleScissorsTool,
  segmentation,
  SegmentationDisplayTool,
  SphereScissorsTool,
} from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  MouseBindings,
  SegmentationRepresentations,
} from '@cornerstonejs/tools/dist/esm/enums';
import {
  getBrushThresholdForToolGroup,
  setBrushSizeForToolGroup,
  setBrushThresholdForToolGroup,
} from '@cornerstonejs/tools/dist/esm/utilities/segmentation';

import {
  addDropdownToToolbar,
  addSliderToToolbar,
} from '@/tools/cornerstoneTools';

const BUG = true;

export const segmentationBrushAndScissors = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
  segmentationId: string,
) => {
  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  // ツールグループが作成されなかった場合、関数を終了します
  if (!toolGroup) return;

  // segmentation.removeSegmentationsFromToolGroup(toolGroupId);

  // Add some segmentations based on the source data volume
  await addSegmentationsToState(volumeId, segmentationId);

  // // Add the segmentation representation to the toolgroup
  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);

  const brushInstanceNames = {
    CircularBrush: 'CircularBrush',
    CircularEraser: 'CircularEraser',
    SphereBrush: 'SphereBrush',
    SphereEraser: 'SphereEraser',
    ThresholdBrush: 'ThresholdBrush',
  };

  const brushStrategies = {
    [brushInstanceNames.CircularBrush]: 'FILL_INSIDE_CIRCLE',
    [brushInstanceNames.CircularEraser]: 'ERASE_INSIDE_CIRCLE',
    [brushInstanceNames.SphereBrush]: 'FILL_INSIDE_SPHERE',
    [brushInstanceNames.SphereEraser]: 'ERASE_INSIDE_SPHERE',
    [brushInstanceNames.ThresholdBrush]: 'THRESHOLD_INSIDE_CIRCLE',
  };

  const brushValues = [
    brushInstanceNames.CircularBrush,
    brushInstanceNames.CircularEraser,
    brushInstanceNames.SphereBrush,
    brushInstanceNames.SphereEraser,
    brushInstanceNames.ThresholdBrush,
  ];

  const optionsValues = [
    ...brushValues,
    RectangleScissorsTool.toolName,
    CircleScissorsTool.toolName,
    SphereScissorsTool.toolName,
    PaintFillTool.toolName,
  ];
  console.log('optionsValues', optionsValues);

  // ============================= //
  addDropdownToToolbar({
    idName,
    onSelectedValueChange: (nameAsStringOrNumber) => {
      const name = String(nameAsStringOrNumber);
      const toolGroup =
        cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
      if (!toolGroup) return;
      // Set the currently active tool disabled
      const toolName = toolGroup.getActivePrimaryMouseButtonTool();

      if (toolName) {
        toolGroup.setToolDisabled(toolName);
      }

      if (brushValues.includes(name)) {
        toolGroup.setToolActive(name, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
      } else {
        const toolName = name;

        toolGroup.setToolActive(toolName, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
      }
    },
    options: { defaultValue: BrushTool.toolName, values: optionsValues },
    toolbar,
  });

  // const thresholdOptions = ['MRI : (0, 200)', 'MRI : (1000, 2000)'];

  // addDropdownToToolbar({
  //   idName,
  //   onSelectedValueChange: (nameAsStringOrNumber) => {
  //     const name = String(nameAsStringOrNumber);

  //     let threshold;
  //     if (name === thresholdOptions[0]) {
  //       threshold = [0, 200];
  //     } else if (name == thresholdOptions[1]) {
  //       threshold = [1000, 2000];
  //     }

  //     setBrushThresholdForToolGroup(toolGroupId, threshold as Types.Point2);
  //   },
  //   options: { defaultValue: thresholdOptions[0], values: thresholdOptions },
  //   toolbar,
  // });
  setBrushThresholdForToolGroup(toolGroupId, [0, 200] as Types.Point2);
  updateThresholdDOM(toolbar, toolGroupId, [0, 200]);

  addSliderToToolbar({
    title: '閾値下限',
    defaultValue: 0,
    idName,
    onSelectedValueChange: (valueAsStringOrNumber) => {
      let value = Number(valueAsStringOrNumber);
      const threshold = getBrushThresholdForToolGroup(toolGroupId);
      if (value > threshold[1]) value = threshold[1];
      BUG && console.log('threshold', threshold);
      const threshold_new = [value, threshold[1]] as Types.Point2;
      setBrushThresholdForToolGroup(toolGroupId, threshold_new as Types.Point2);
      updateThresholdDOM(toolbar, toolGroupId, threshold);
    },
    range: [0, 3000],
    toolbar,
  });

  addSliderToToolbar({
    title: '閾値上限',
    defaultValue: 1000,
    idName,
    onSelectedValueChange: (valueAsStringOrNumber) => {
      let value = Number(valueAsStringOrNumber);
      const threshold = getBrushThresholdForToolGroup(toolGroupId);
      if (threshold[0] > value) value = threshold[0];
      BUG && console.log('threshold', threshold);
      const threshold_new = [threshold[0], value] as Types.Point2;
      setBrushThresholdForToolGroup(toolGroupId, threshold_new as Types.Point2);
      updateThresholdDOM(toolbar, toolGroupId, threshold);
    },
    range: [0, 3000],
    toolbar,
  });

  addSliderToToolbar({
    title: 'Brush Size',
    defaultValue: 25,
    idName,
    onSelectedValueChange: (valueAsStringOrNumber) => {
      const value = Number(valueAsStringOrNumber);
      setBrushSizeForToolGroup(toolGroupId, value);
    },
    range: [5, 50],
    toolbar,
  });
  // ============= run ================ //


  toolGroup.addToolInstance(
    brushInstanceNames.CircularBrush,
    BrushTool.toolName,
    {
      activeStrategy: brushStrategies.CircularBrush,
    },
  );
  toolGroup.addToolInstance(
    brushInstanceNames.CircularEraser,
    BrushTool.toolName,
    {
      activeStrategy: brushStrategies.CircularEraser,
    },
  );
  toolGroup.addToolInstance(
    brushInstanceNames.SphereBrush,
    BrushTool.toolName,
    {
      activeStrategy: brushStrategies.SphereBrush,
    },
  );
  toolGroup.addToolInstance(
    brushInstanceNames.SphereEraser,
    BrushTool.toolName,
    {
      activeStrategy: brushStrategies.SphereEraser,
    },
  );
  toolGroup.addToolInstance(
    brushInstanceNames.ThresholdBrush,
    BrushTool.toolName,
    {
      activeStrategy: brushStrategies.ThresholdBrush,
    },
  );
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(brushInstanceNames.CircularBrush, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });
};

async function addSegmentationsToState(
  volumeId: string,
  segmentationId: string,
) {
  // Add the segmentations to state
  segmentation.addSegmentations([
    {
      representation: {
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId,
        },
        // The type of segmentation
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId,
    },
  ]);
}

const updateThresholdDOM = async (
  toolbar: HTMLElement,
  toolGroupId: string,
  threshold: Types.Point2,
) => {
  // 既存のthresholdDOMを探す
  const existingThresholdDOM = toolbar.querySelector('p');

  // 既存のthresholdDOMがあれば削除する
  if (existingThresholdDOM) {
    toolbar.removeChild(existingThresholdDOM);
  }

  // 新しいthresholdDOMを作成する
  const thresholdDOM = document.createElement('p');
  thresholdDOM.className =
    'font-bold border-blue-700 bg-blue-500 text-white py-1 px-2 m-2 transition-colors duration-200 ease-in-out hover:bg-opacity-75 hover:border-purple-700';
  const thresholdValues = getBrushThresholdForToolGroup(toolGroupId);
  thresholdDOM.innerText = `閾値[${threshold[0]}, ${threshold[1]}]`;

  // 新しいthresholdDOMを追加する
  toolbar.append(thresholdDOM);
};
