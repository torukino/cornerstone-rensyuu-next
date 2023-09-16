import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

const {
  PanTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

export const getToolGroupSetting = (
  element: HTMLElement,
): cornerstoneTools.Types.IToolGroup | undefined => {
  // addTool
  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  const toolGroupId = 'TOOL_GROUP_ID';
  if (cornerstoneTools) cornerstoneTools.destroy();
  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(WindowLevelTool);
  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup: cornerstoneTools.Types.IToolGroup | undefined =
    ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;
  // Add tools to the tool group
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(WindowLevelTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // Middle Click
      },
    ],
  });
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });

  //ここまで
  return toolGroup;
};
