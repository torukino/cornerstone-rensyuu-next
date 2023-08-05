import { Scaling } from '@cornerstonejs/core/dist/esm/types';

import IImageCalibration from '@/types/cornerstone/IImageCalibration';
import Mat3 from '@/types/cornerstone/Mat3';
import { PixelDataTypedArray } from '@/types/cornerstone/PixelDataTypedArray';
import Point3 from '@/types/cornerstone/Point3';

type CPUImageData = {
  getDimensions?: () => Point3;
  getDirection?: () => Mat3;
  getIndexToWorld?: () => Point3;
  getScalarData?: () => PixelDataTypedArray;
  /** Last spacing is always EPSILON */
  getSpacing?: () => Point3;
  getWorldToIndex?: () => Point3;
  indexToWorld?: (point: Point3) => Point3;
  /** Last index is always 1 */
  worldToIndex?: (point: Point3) => Point3;
};

type CPUIImageData = {
  calibration?: IImageCalibration;
  dimensions: Point3;
  direction: Mat3;
  hasPixelSpacing?: boolean;
  imageData: CPUImageData;
  metadata: { Modality: string };
  origin: Point3;
  preScale?: {
    /** boolean flag to indicate whether the image has been scaled */
    scaled?: boolean;
    /** scaling parameters */
    scalingParameters?: {
      /** modality of the image */
      modality?: string;
      /** rescale slop */
      rescaleIntercept?: number;
      /** rescale intercept */
      rescaleSlope?: number;
      /** PT suvbw */
      suvbw?: number;
    };
  };
  /** whether the image has pixel spacing and it is not undefined */
  scalarData: PixelDataTypedArray;
  scaling: Scaling;

  /** preScale object */
  spacing: Point3;
};

export default CPUIImageData;
