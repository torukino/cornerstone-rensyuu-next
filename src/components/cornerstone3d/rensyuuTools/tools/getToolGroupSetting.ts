import { ImageVolume } from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { segmentationTutorialBrush } from '@/components/cornerstone3d/rensyuuTools/tools/segmentationTutorialBrush';

const { SegmentationDisplayTool } = cornerstoneTools;
/**
 * デモセグメンテーションの各軸スライスに2つの同心円を追加する。
 */

export const getSegmentToolGroupSetting = async (
  idName: string,
  toolbar: HTMLElement,
  element: HTMLElement,
  volumeId: string,
  toolGroupId: string,
  renderingEngineId: string,
  viewportId: string,
  segmentationId: string,
  volumeSegmentation: ImageVolume,
): Promise<void | undefined> => {
  // segmentation rendering mockEllipsoidSegmentation
  // segmentationRenderingEllipsoid(
  //   volumeId,
  //   toolGroupId,
  //   volumeSegmentation,
  //   segmentationId,
  // );

  // segmentation swap
  // segmentationSwap(volumeId, toolGroupId, idName, toolbar);

  // segmentation brush and scissors
  // await segmentationBrushAndScissors(
  //   volumeId,
  //   toolGroupId,
  //   idName,
  //   toolbar,
  //   segmentationId,
  // );

  //tutorial brush
  await segmentationTutorialBrush(
    volumeId,
    toolGroupId,
    idName,
    toolbar,
    segmentationId,
  );

  //Global Labelmap Segmentation Configuration
  // await setGlobalLabelmapSegmentationConfiguration(
  //   volumeId,
  //   toolGroupId,
  //   idName,
  //   toolbar,
  //   renderingEngineId,
  //   viewportId,
  // );

  // setLabelmapSegmentSpecificConfiguration({
  //   idName,
  //   renderingEngineId,
  //   toolbar,
  //   toolGroupId,
  //   viewportId,
  //   volumeId,
  // });

  // return toolGroup;
};
