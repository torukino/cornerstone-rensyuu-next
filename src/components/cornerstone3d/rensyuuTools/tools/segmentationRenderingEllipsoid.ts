import { ImageVolume } from '@cornerstonejs/core';
import { segmentation } from '@cornerstonejs/tools';
import { SegmentationRepresentations } from '@cornerstonejs/tools/dist/esm/enums';

export const segmentationRenderingEllipsoid = async (
  volumeId: string,
  toolGroupId: string,
  volumeSegmentation: ImageVolume,
  segmentationId: string,
) => {
  // ボリュームのソースデータと同じ解像度のセグメンテーションを作成する。

  // Add some data to the segmentations
  createMockEllipsoidSegmentation(volumeSegmentation);
console.log('volumeSegmentation', volumeSegmentation.getScalarData());
  //セグメンテーションをステートに追加する
  segmentation.addSegmentations([
    {
      representation: {
        // 実際のセグメンテーションデータ（labelmap の場合）。
        // セグメンテーションのソースボリュームへの参照。
        data: {
          volumeId: segmentationId,
        },
        // セグメンテーションの種類
        type: SegmentationRepresentations.Labelmap,
      },
      segmentationId,
    },
  ]);

  await segmentation.addSegmentationRepresentations(toolGroupId, [
    {
      segmentationId,
      type: SegmentationRepresentations.Labelmap,
    },
  ]);
};

function createMockEllipsoidSegmentation(segmentationVolume: ImageVolume) {
  const scalarData = segmentationVolume.getScalarData();
  const { dimensions } = segmentationVolume;

  const center = [dimensions[0] / 2, dimensions[1] / 2, dimensions[2] / 2];
  const outerRadius = 50;
  const innerRadius = 10;

  let voxelIndex = 0;

  for (let z = 0; z < dimensions[2]; z++) {
    for (let y = 0; y < dimensions[1]; y++) {
      for (let x = 0; x < dimensions[0]; x++) {
        const distanceFromCenter = Math.sqrt(
          (x - center[0]) * (x - center[0]) +
            (y - center[1]) * (y - center[1]) +
            (z - center[2]) * (z - center[2]),
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
