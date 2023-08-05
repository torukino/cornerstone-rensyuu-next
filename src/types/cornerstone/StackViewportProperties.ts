import InterpolationType from '@/enums/cornerstone/InterpolationType';
import { ViewportProperties } from '@/types/cornerstone/ViewportProperties';

/**
 * Stack Viewport Properties
 */
type StackViewportProperties = ViewportProperties & {
  /** interpolation type - linear or nearest neighbor */
  interpolationType?: InterpolationType;
  /** image rotation */
  isComputedVOI?: boolean;
  /** suppress events (optional) */
  rotation?: number;
  /** Indicates if the voi is a computed VOI (not user set) */
  suppressEvents?: boolean;
};

export default StackViewportProperties;
