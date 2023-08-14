import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

const {
  Enums: csToolsEnums,
  PanTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

export const setToolGroups = (
  viewportId: string,
  renderingEngineId: string,
) => {
  const toolGroupId = 'native_tool_group';


  if (!ToolGroupManager.getToolGroup(toolGroupId)) {
    // Add tools to Cornerstone3D
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(WindowLevelTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.addTool(ZoomTool);
  }


  // ツールグループを定義し、マウスイベントが以下のツールコマンドにどのようにマッピングされるかを定義します。
  // グループを使用するすべてのビューポート
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!toolGroup) return;


  // ツールグループにツールを追加する
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);


  // ツールの初期状態を設定する。
  toolGroup.setToolActive(cornerstoneTools.PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // 中央クリック
      },
    ],
  });
  toolGroup.setToolActive(cornerstoneTools.ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // 右クリック
      },
    ],
  });
  // スタックスクロールマウスホイールは、マウスボタンの代わりに `mouseWheelCallback` フックを使用するツールです。
  // フックを使用するツールであるため、マウスボタンを割り当てる必要はありません。
  toolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);

  // ビューポートにツールグループを設定する
  toolGroup.addViewport(viewportId, renderingEngineId);
};
