import CPUFallbackColormap from '@types/cornerstone/CPUFallbackColormap';

import CPUFallbackEnabledElement from '@/types/cornerstone/CPUFallbackEnabledElement';
import CPUFallbackLUT from '@/types/cornerstone/CPUFallbackLUT';
import { PixelDataTypedArray } from '@/types/cornerstone/PixelDataTypedArray';

/**
 * Cornerstone Image interface, it is used for both CPU and GPU rendering
 */
interface IImage {
  /** Image Id */
  color: boolean;
  colormap?: CPUFallbackColormap;
  /** Whether the image is Pre-scaled during loading */
  columnPixelSpacing: number;
  /** preScale object */
  cachedLut?: {
    invert?: boolean;
    lutArray?: Uint8ClampedArray;
    windowCenter?: number | number[];
    modalityLUT?: unknown;
    windowWidth?: number | number[];
    voiLUT?: CPUFallbackLUT;
  };
  /** minimum pixel value of the image */
  columns: number;
  /* maximum pixel value of the image */
  getCanvas: () => HTMLCanvasElement;
  /** slope from metadata for scaling */
  getPixelData: () => PixelDataTypedArray;
  /** intercept from metadata for scaling */
  height: number;
  /** windowCenter from metadata */
  imageId: string;
  /** windowWidth from metadata */
  intercept: number;
  /** voiLUTFunction from metadata */
  invert: boolean;
  /** function that returns the pixelData as an array */
  isPreScaled?: boolean;
  maxPixelValue: number;
  /** image number of rows */
  minPixelValue: number;
  /** image number of columns */
  modalityLUT?: CPUFallbackLUT;
  /** image height */
  numComps: number;
  /** image width */
  photometricInterpretation?: string;
  /** is image a color image */
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
  /** is image rgb and alpha */
  render?: (
    enabledElement: CPUFallbackEnabledElement,
    invalidated: boolean,
  ) => unknown;
  /** number of components in the image */
  rgba: boolean;
  /** CPU: custom render method for the image */
  rowPixelSpacing: number;
  /** column pixel spacing */
  rows: number;
  /** row pixel spacing */
  scaling?: {
    PT?: {
      // @TODO: Do these values exist?
      SUVbsaFactor?: number;
      suvbwToSuvbsa?: number;
      // accessed in ProbeTool
      suvbwToSuvlbm?: number;
      SUVlbmFactor?: number;
    };
  };
  /** slice thickness */
  sharedCacheKey?: string;
  /** whether image pixels are inverted in color */
  sizeInBytes: number;
  /** image photometric interpretation */
  sliceThickness?: number;
  /** image size in number of bytes */
  slope: number;
  /** CPU: custom modality LUT for image  */
  stats?: {
    lastGetPixelDataTime?: number;
    lastLutGenerateTime?: number;
    lastPutImageDataTime?: number;
    lastRenderedViewport?: unknown;
    lastRenderTime?: number;
    lastStoredPixelDataToCanvasImageDataTime?: number;
  };
  /** CPU: custom VOI LUT for image  */
  voiLUT?: CPUFallbackLUT;
  /** CPU: custom color map for image  */
  voiLUTFunction: string;
  /** image scaling metadata - including PT suv values */
  width: number;
  /** CPU: image statistics for rendering */
  windowCenter: number[] | number;
  /** CPU: image cached LUT */
  windowWidth: number[] | number;
}

export default IImage;
