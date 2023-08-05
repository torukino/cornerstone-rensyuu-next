import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';

import Mat3 from '@/types/cornerstone/Mat3';
import Point3 from '@/types/cornerstone/Point3';
import { Scaling } from '@/types/cornerstone/ScalingParameters';

import IImageCalibration from './IImageCalibration';

/**
 * IImageData of an image, which stores actual scalarData and metaData about the image.
 * IImageData is different from vtkImageData.
 */
interface IImageData {
  /** image dimensions */
  calibration?: IImageCalibration;
  /** image direction */
  dimensions: Point3;
  /** image spacing */
  direction: Mat3;
  /** image origin */
  hasPixelSpacing?: boolean;
  /** image scalarData which stores the array of pixelData */
  imageData: vtkImageData;
  /** vtkImageData object */
  metadata: { Modality: string };
  /** image metadata - currently only modality */
  origin: Point3;
  /** image scaling for scaling pixelArray */
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
  scalarData: Float32Array | Uint16Array | Uint8Array | Int16Array;

  scaling?: Scaling;

  /** preScale object */
  spacing: Point3;
}

export default IImageData;
