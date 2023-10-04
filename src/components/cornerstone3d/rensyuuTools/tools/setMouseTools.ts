import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

const { PanTool, StackScrollMouseWheelTool, WindowLevelTool, ZoomTool } =
  cornerstoneTools;

export const setMouseTools = async (
  toolGroupId: string,
  element: HTMLElement,
): Promise<void | undefined> => {
  // Disable right click context menu so we can have right click tools
  element.oncontextmenu = (e) => e.preventDefault();

  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  if (!toolGroup) return undefined;
  /**
   * ここからツールの設定
   */

  // Set the active tool for the group
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // middle Click
      },
    ],
  });

  // toolGroup.setToolActive(WindowLevelTool.toolName, {
  //   bindings: [
  //     {
  //       mouseButton: MouseBindings.Auxiliary, // Middle Click
  //     },
  //   ],
  // });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });
};
