import {
  cache,
  Enums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  Types,
  volumeLoader,
} from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';
import { destroyToolGroup } from '@cornerstonejs/tools/dist/esm/store/ToolGroupManager';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  initDemo,
  setCtTransferFunctionForVolumeActor,
} from '@/tools/cornerstoneTools';
import addDropdownToToolbar3D from '@/tools/cornerstoneTools/addDropdownToToolbar3D';
import { VOIRange } from '@/types/cornerstone/voi';

const { CrosshairsTool, StackScrollMouseWheelTool, ToolGroupManager } =
  cornerstoneTools;

cornerstoneTools.addTool(CrosshairsTool);
cornerstoneTools.addTool(StackScrollMouseWheelTool);

export const runMainVolume3DHair = async (
  idName: string,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
  DerivativeDiscription: string,
): Promise<void> => {
  cache.purgeCache();
  const gcp = true;
  await initDemo(gcp);

  // Define a unique id for the volume
  const volumeName = idName + 'CT_VOLUME_ID'; // Id of the volume less loader prefix
  const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
  const volumeId = idName + `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
  const toolGroupId = idName + 'MY_TOOLGROUP_ID';

  // TODO: ここでelementに追加しているから、別の写真をレンダリングした後に他の別の写真をクリックしたら２枚表示されるエラーが生じるのでは？
  const content = document.getElementById(idName + '-content');
  if (!content) return;

  // const element: HTMLDivElement = document.createElement('div');
  // Disable right click context menu so we can have right click tools
  // element.oncontextmenu = (e) => e.preventDefault();
  // これにより、右クリックメニューが表示されなくなります。
  // element.id = 'cornerstone-element';
  // element.style.width = '500px';
  // element.style.height = '500px';
  // content.appendChild(element);

  /********************
   * 3D ここから追加
   */
  const size = '500px';
  const viewportGrid = document.createElement('div');

  viewportGrid.style.display = 'flex';
  viewportGrid.style.display = 'flex';
  viewportGrid.style.flexDirection = 'row';

  const element1 = document.createElement('div');
  const element2 = document.createElement('div');
  const element3 = document.createElement('div');
  element1.style.width = size;
  element1.style.height = size;
  element2.style.width = size;
  element2.style.height = size;
  element3.style.width = size;
  element3.style.height = size;

  // Disable right click context menu so we can have right click tools
  element1.oncontextmenu = (e) => e.preventDefault();
  element2.oncontextmenu = (e) => e.preventDefault();
  element3.oncontextmenu = (e) => e.preventDefault();

  viewportGrid.appendChild(element1);
  viewportGrid.appendChild(element2);
  viewportGrid.appendChild(element3);

  content.appendChild(viewportGrid);

  const instructions = document.createElement('p');
  instructions.innerText = `
  基本的なコントロール
  - 十字線の中心を移動するには、ビューポートの任意の場所をクリック/ドラッグします。
  - 参照線をドラッグして移動し、他のビューをスクロールする。

  高度なコントロール：線の上にカーソルを置くと、次の2つのハンドルが表示されます：
  - 正方形（中心に最も近い）：これをドラッグすると、その平面のMIPスラブの厚さを変更できます。
  - 円（中心から遠い）：これをドラッグすると軸が回転します。
  `;

  content.append(instructions);

  const viewportId1 = 'MRI_AXIAL';
  const viewportId2 = 'MRI_SAGITTAL';
  const viewportId3 = 'MRI_CORONAL';

  const viewportColors = {
    [viewportId1]: 'rgb(200, 0, 0)',
    [viewportId2]: 'rgb(200, 200, 0)',
    [viewportId3]: 'rgb(0, 200, 0)',
  };

  const viewportReferenceLineControllable = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];

  const viewportReferenceLineDraggableRotatable = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];

  const viewportReferenceLineSlabThicknessControlsOn = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];

  function getReferenceLineColor(viewportId: keyof typeof viewportColors) {
    return viewportColors[viewportId];
  }

  function getReferenceLineControllable(viewportId: string) {
    const index = viewportReferenceLineControllable.indexOf(viewportId);
    return index !== -1;
  }

  function getReferenceLineDraggableRotatable(viewportId: string) {
    const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
    return index !== -1;
  }

  function getReferenceLineSlabThicknessControlsOn(viewportId: string) {
    const index =
      viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
    return index !== -1;
  }

  const blendModeOptions = {
    AIP: 'Average Intensity Projection',
    MINIP: 'Minimum Intensity Projection',
    MIP: 'Maximum Intensity Projection',
  };

  const container = document.getElementById(`${idName}-toolbar`);
  if (!container) return;

  addDropdownToToolbar3D({
    container,
    idName,

    onSelectedValueChange: (selectedValue) => {
      let blendModeToUse: any;
      switch (selectedValue) {
        case blendModeOptions.MIP:
          blendModeToUse = Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
          break;
        case blendModeOptions.MINIP:
          blendModeToUse = Enums.BlendModes.MINIMUM_INTENSITY_BLEND;
          break;
        case blendModeOptions.AIP:
          blendModeToUse = Enums.BlendModes.AVERAGE_INTENSITY_BLEND;
          break;
        default:
          throw new Error('undefined orientation option');
      }

      let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
      if (!toolGroup) {
        toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      }
      if (!toolGroup) return;

      const crosshairsInstance = toolGroup.getToolInstance(
        cornerstoneTools.CrosshairsTool.toolName,
      );
      const oldConfiguration = crosshairsInstance.configuration;

      crosshairsInstance.configuration = {
        ...oldConfiguration,
        slabThicknessBlendMode: blendModeToUse,
      };

      // Update the blendMode for actors to instantly reflect the change
      toolGroup.viewportsInfo.forEach(({ renderingEngineId, viewportId }) => {
        const renderingEngine = getRenderingEngine(renderingEngineId);
        if (!renderingEngine) return;
        const viewport = renderingEngine.getViewport(
          viewportId,
        ) as Types.IVolumeViewport;

        viewport.setBlendMode(blendModeToUse);
        viewport.render();
      });
    },
    options: {
      defaultValue: 'Maximum Intensity Projection',
      values: [
        'Maximum Intensity Projection',
        'Minimum Intensity Projection',
        'Average Intensity Projection',
      ],
    },
  });

  // Add tools to Cornerstone3D
  // cornerstoneTools.addTool(StackScrollMouseWheelTool);
  // cornerstoneTools.addTool(CrosshairsTool);

  // Dicom の使い方に従った画像の取得
  const imageIds = await getImageIds(gcp, SeriesInstanceUID, StudyInstanceUID);
  imageIds.sort();
  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });
  console.log(volume);
  // Instantiate a rendering engine
  const renderingEngineId = idName + '-myRenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports
  const viewportInputArray = [
    {
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: Enums.OrientationAxis.AXIAL,
      },
      element: element1,
      type: ViewportType.ORTHOGRAPHIC,
      viewportId: viewportId1,
    },
    {
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
      element: element2,
      type: ViewportType.ORTHOGRAPHIC,
      viewportId: viewportId2,
    },
    {
      defaultOptions: {
        background: <Types.Point3>[0, 0, 0],
        orientation: Enums.OrientationAxis.CORONAL,
      },
      element: element3,
      type: ViewportType.ORTHOGRAPHIC,
      viewportId: viewportId3,
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the volume to load
  volume.load();

  // Set volumes on the viewports
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        callback: setCtTransferFunctionForVolumeActor,
        volumeId,
      },
    ],
    [viewportId1, viewportId2, viewportId3],
  );

  // Define tool groups to add the segmentation display tool to
  destroyToolGroup(toolGroupId);
  let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  if (!toolGroup) return;

  // 十字線を動作させるには、現在、ビューポートを
  // を追加する必要があります。これは将来改善される予定です。
  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);

  // ツールをライブラリに登録
  if (!ToolGroupManager.getToolGroupsWithToolName('Crosshairs')) {
    cornerstoneTools.addTool(CrosshairsTool);
  }
  if (!ToolGroupManager.getToolGroupsWithToolName('StackScrollMouseWheel')) {
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
  }

  // Manipulation Tools
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  // 十字ツールを追加し、3つのビューポートをリンクするように設定します。
  // これらのビューポートは異なるツールグループを使用することができます。PET-CTの例
  // を参照してください。

  const isMobile = window.matchMedia('(any-pointer:coarse)').matches;

  toolGroup.addTool(cornerstoneTools.CrosshairsTool.toolName, {
    getReferenceLineColor,
    getReferenceLineControllable,
    getReferenceLineDraggableRotatable,
    getReferenceLineSlabThicknessControlsOn,
    mobile: {
      enabled: isMobile,
      handleRadius: 9,
      opacity: 0.8,
    },
  });

  toolGroup.setToolActive(cornerstoneTools.CrosshairsTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });
  // スタックスクロールマウスホイールは、マウスボタンの代わりに `mouseWheelCallback` フックを使用するツールです。
  // フックを使用するツールなので、マウスボタンを割り当てる必要はありません。
  toolGroup.setToolActive(cornerstoneTools.StackScrollMouseWheelTool.toolName);

  // Render the image
  renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
  console.log('Viewports rendered'); // レンダリングが完了したことをログに出力
  // あなたのMRI T1画像に適したVOI範囲を設定します。
  const voiRange: VOIRange = { lower: 0, upper: 2500 }; // これは例です。実際の値はあなたの画像によります。

  // ビューポートを取得します。
  const viewport1 = renderingEngine.getViewport(
    viewportId1,
  ) as Types.IVolumeViewport;
  const viewport2 = renderingEngine.getViewport(
    viewportId2,
  ) as Types.IVolumeViewport;
  const viewport3 = renderingEngine.getViewport(
    viewportId3,
  ) as Types.IVolumeViewport;

  // voiRangeを設定します。
  viewport1.setProperties({ voiRange }, volumeId);
  viewport1.render();
  console.log('Viewport 1 rendered with VOI range'); // VOI範囲を設定してレンダリングしたことをログに出力

  viewport2.setProperties({ voiRange }, volumeId);
  viewport2.render();
  viewport3.setProperties({ voiRange }, volumeId);
  viewport3.render();
};
