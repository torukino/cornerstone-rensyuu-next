import VOILUTFunctionType from '@/enums/cornerstone/VOILUTFunctionType';
import { VOIRange } from '@/types/cornerstone/voi';

/**
 * Shared Viewport Properties between Stack and Volume Viewports
 */
type ViewportProperties = {
  /** voi range (upper, lower) for the viewport */
  invert?: boolean;
  /** VOILUTFunction type which is LINEAR or SAMPLED_SIGMOID */
  VOILUTFunction?: VOILUTFunctionType;
  /** invert flag - whether the image is inverted */
  voiRange?: VOIRange;
};

export type { ViewportProperties };
