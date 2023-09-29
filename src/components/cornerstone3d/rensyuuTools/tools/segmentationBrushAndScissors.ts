import { Types, volumeLoader } from '@cornerstonejs/core';
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
  setBrushSizeForToolGroup,
  setBrushThresholdForToolGroup,
} from '@cornerstonejs/tools/dist/esm/utilities/segmentation';

import {
  addDropdownToToolbar,
  addSliderToToolbar,
} from '@/tools/cornerstoneTools';

export const segmentationBrushAndScissors = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
  toolGroup: cornerstoneTools.Types.IToolGroup,
) => {
  const segmentationBrushAndScissorsId =
    'segmentation_brush_scissors' + Date.now();

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

  // Segmentation Tools
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.addTool(RectangleScissorsTool.toolName);
  toolGroup.addTool(CircleScissorsTool.toolName);
  toolGroup.addTool(SphereScissorsTool.toolName);
  toolGroup.addTool(PaintFillTool.toolName);
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

  // Add some segmentations based on the source data volume
  await addSegmentationsToState(volumeId, segmentationBrushAndScissorsId);

  // ============================= //
  addDropdownToToolbar({
    idName,
    onSelectedValueChange: (nameAsStringOrNumber) => {
      const name = String(nameAsStringOrNumber);
      const toolGroup =
        cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);

      // Set the currently active tool disabled
      const toolName = toolGroup?.getActivePrimaryMouseButtonTool();

      if (toolName) {
        toolGroup?.setToolDisabled(toolName);
      }

      if (brushValues.includes(name)) {
        toolGroup?.setToolActive(name, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
      } else {
        const toolName = name;

        toolGroup?.setToolActive(toolName, {
          bindings: [{ mouseButton: MouseBindings.Primary }],
        });
      }
    },
    options: { defaultValue: BrushTool.toolName, values: optionsValues },
    toolbar,
  });

  const thresholdOptions = ['CT Fat: (-150, -70)', 'CT Bone: (200, 1000)'];

  addDropdownToToolbar({
    idName,
    onSelectedValueChange: (nameAsStringOrNumber) => {
      const name = String(nameAsStringOrNumber);

      let threshold;
      if (name === thresholdOptions[0]) {
        threshold = [-150, -70];
      } else if (name == thresholdOptions[1]) {
        threshold = [100, 1000];
      }

      setBrushThresholdForToolGroup(toolGroupId, threshold as Types.Point2);
    },
    options: { defaultValue: thresholdOptions[0], values: thresholdOptions },
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
};

async function addSegmentationsToState(
  volumeId: string,
  segmentationId: string,
) {
  // Create a segmentation of the same resolution as the source data
  // using volumeLoader.createAndCacheDerivedVolume.
  await volumeLoader.createAndCacheDerivedVolume(volumeId, {
    volumeId: segmentationId,
  });

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
