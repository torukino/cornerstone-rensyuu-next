import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

const { PanTool, StackScrollMouseWheelTool, WindowLevelTool, ZoomTool } =
  cornerstoneTools;

export const setMouseTools = async (
  toolGroupId: string,
  element: HTMLElement,
) => {
  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  cornerstoneTools.removeTool(StackScrollMouseWheelTool);
  cornerstoneTools.removeTool(PanTool);
  cornerstoneTools.removeTool(ZoomTool);
  cornerstoneTools.removeTool(WindowLevelTool);

  /**
   * ここからツールの設定
   */

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(WindowLevelTool);
  // Add tools to Cornerstone3D

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return;
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(WindowLevelTool.toolName);

  // Set the active tool for the group
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // middle Click
      },
    ],
  });

  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // Middle Click
      },
    ],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });
};
