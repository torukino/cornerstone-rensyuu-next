import { getRenderingEngine, volumeLoader } from '@cornerstonejs/core';
import { segmentation } from '@cornerstonejs/tools';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

import {
  addSliderToToolbar,
  addToggleButtonToToolbar,
} from '@/tools/cornerstoneTools';

const BUG = true;
export const setGlobalLabelmapSegmentationConfiguration = async (
  volumeId: string,
  toolGroupId: string,
  idName: string,
  toolbar: HTMLElement,
  renderingEngineId: string,
  viewportId: string,
) => {
  // ============================= //
  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
  // ツールグループが作成されなかった場合、関数を終了します
  if (!toolGroup) return;

  segmentation.removeSegmentationsFromToolGroup(toolGroupId);

  // この関数は、ツールバーに「segmentations切替」ボタンを追加します。
  // ボタンがクリックされると、segmentationの設定が更新され、
  // レンダリングエンジンがビューポートを再描画します。
  // ここでは、configの内容のうち、
  // renderInactiveSegmentationsがトグルされます。
  addToggleButtonToToolbar({
    title: 'セグメント切替',
    defaultToggle: false,

    onClick: (toggle) => {
      // segmentationのグローバル設定を取得します。
      const config = segmentation.config.getGlobalConfig();
      if (!config.representations.LABELMAP) return;
      BUG && console.log('@@@ config @@@', config);
    
      config.representations.LABELMAP.outlineWidthActive = 10;
    
      // 非アクティブなsegmentationsのレンダリングを切り替えます。
      config.renderInactiveSegmentations = toggle;
      
      // 更新した設定をグローバル設定としてセットします。
      segmentation.config.setGlobalConfig(config);

      // レンダリングエンジンを取得します。
      const renderingEngine = getRenderingEngine(renderingEngineId);
      // レンダリングエンジンが存在しない場合、関数を終了します。
      if (!renderingEngine) return;
      // ビューポートを再描画します。
      renderingEngine.renderViewports([viewportId]);
    },
    toolbar,
  });

  // 外輪 representation.rebderOutlineがトグルされます
  addToggleButtonToToolbar({
    title: '外輪トグル',
    defaultToggle: true,
    onClick: (toggle) => {
      const config1 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config1 @@@', config1);
      setConfigValue('renderOutline', toggle, renderingEngineId, viewportId);
      const config2 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config2 @@@', config2);
    },
    toolbar,
  });

  addToggleButtonToToolbar({
    title: '塗りつぶし',
    defaultToggle: true,
    onClick: (toggle) => {
      const config3 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config3 @@@', config3);
      setConfigValue('renderFill', toggle, renderingEngineId, viewportId);
      const config4 = segmentation.config.getGlobalConfig();
      BUG && console.log('@@@ config4 @@@', config4);
    },
    toolbar,
  });

  addSliderToToolbar({
    title: 'outline width active',
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineWidthActive',
        value,
        renderingEngineId,
        viewportId,
      );
    },
    range: [1, 5],
    toolbar,
  });

  addSliderToToolbar({
    title: 'outline alpha active',
    defaultValue: 100,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineOpacity',
        Number(value) / 100,
        renderingEngineId,
        viewportId,
      );
    },
    range: [0, 100],
    toolbar,
  });
  addSliderToToolbar({
    title: 'outline width inactive',
    defaultValue: 1,
    idName,
    onSelectedValueChange: (value) => {
      setConfigValue(
        'outlineWidthInactive',
        value,
        renderingEngineId,
        viewportId,
      );
    },
    range: [1, 5],
    toolbar,
  });
  addSliderToToolbar({
    title: 'fill alpha',
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;

      setConfigValue('fillAlpha', mappedValue, renderingEngineId, viewportId);
    },
    range: [0, 100],
    toolbar,
  });
  addSliderToToolbar({
    title: 'fill alpha inactive',
    defaultValue: 50,
    idName,
    onSelectedValueChange: (value) => {
      const mappedValue = Number(value) / 100.0;
      setConfigValue(
        'fillAlphaInactive',
        mappedValue,
        renderingEngineId,
        viewportId,
      );
    },
    range: [0, 100],
    toolbar,
  });

  // ===========

  // Add some segmentations based on the source data volume
  const segmentationId1 = 'segmentationId1' + Date.now();
  const segmentationId2 = 'segmentationId2' + Date.now();

  await addSegmentationsToState(volumeId, segmentationId1, segmentationId2);

  // // Add the segmentation representations to the toolgroup
  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId: segmentationId1,
      type: SegmentationRepresentations.Labelmap,
    },
    {
      segmentationId: segmentationId2,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);
};

/**
 * Adds two concentric circles to each axial slice of the demo segmentation.
 */
function fillSegmentationWithCircles(
  segmentationVolume: any,
  centerOffset: any,
) {
  const scalarData = segmentationVolume.scalarData;

  let voxelIndex = 0;

  const { dimensions } = segmentationVolume;

  const innerRadius = dimensions[0] / 8;
  const outerRadius = dimensions[0] / 4;

  const center = [
    dimensions[0] / 2 + centerOffset[0],
    dimensions[1] / 2 + centerOffset[1],
  ];

  for (let z = 0; z < dimensions[2]; z++) {
    for (let y = 0; y < dimensions[1]; y++) {
      for (let x = 0; x < dimensions[0]; x++) {
        const distanceFromCenter = Math.sqrt(
          (x - center[0]) * (x - center[0]) + (y - center[1]) * (y - center[1]),
        );
        if (distanceFromCenter < innerRadius) {
          scalarData[voxelIndex] = 1;
        } else if (distanceFromCenter < outerRadius) {
          scalarData[voxelIndex] = 2;
        }

        voxelIndex++;
      }
    }
  }
}

async function addSegmentationsToState(
  volumeId: string,
  segmentationId1: string,
  segmentationId2: string,
) {
  // ソースデータと同じ解像度のセグメンテーションを作成する。
  // VolumeLoader.createAndCacheDerivedVolumeを使用。.
  const segmentationVolume1 = await volumeLoader.createAndCacheDerivedVolume(
    volumeId,
    {
      volumeId: segmentationId1,
    },
  );
  const segmentationVolume2 = await volumeLoader.createAndCacheDerivedVolume(
    volumeId,
    {
      volumeId: segmentationId2,
    },
  );

  // Add the segmentations to state
  segmentation.addSegmentations([
    {
      representation: {
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId1,
        },
        // The type of segmentation
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId: segmentationId1,
    },
    {
      representation: {
        data: {
          volumeId: segmentationId2,
        },
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId: segmentationId2,
    },
  ]);

  // Add some data to the segmentations
  fillSegmentationWithCircles(segmentationVolume1, [50, 50]);
  fillSegmentationWithCircles(segmentationVolume2, [-50, -50]);
}

function setConfigValue(
  property: any,
  value: any,
  renderingEngineId: any,
  viewportId: any,
) {
  const config = segmentation.config.getGlobalConfig();
  if (config.representations && config.representations.LABELMAP) {
    (config.representations.LABELMAP as any)[property] = value;
  } else return;

  segmentation.config.setGlobalConfig(config);

  const renderingEngine = getRenderingEngine(renderingEngineId);
  if (!renderingEngine) return;
  renderingEngine.renderViewports([viewportId]);
}
