import {
  CPUFallbackViewport,
  IImage,
  Mat3,
} from '@cornerstonejs/core/dist/esm/types';

import CPUFallbackColormap from '@/types/cornerstone/CPUFallbackColormap';
import CPUFallbackRenderingTools from '@/types/cornerstone/CPUFallbackRenderingTools';
import CPUFallbackTransform from '@/types/cornerstone/CPUFallbackTransform';
import { ImagePixelModule } from '@/types/cornerstone/ImagePixelModule';
import { ImagePlaneModule } from '@/types/cornerstone/ImagePlaneModule';
import Point2 from '@/types/cornerstone/Point2';
import Point3 from '@/types/cornerstone/Point3';

interface CPUFallbackEnabledElement {
  canvas?: HTMLCanvasElement;
  colormap?: CPUFallbackColormap;
  image?: IImage;
  invalid?: boolean;
  metadata?: {
    dimensions?: Point3;
    /** Last index is always 1 for CPU */
    direction?: Mat3;
    /** Last spacing is always EPSILON for CPU */
    imagePixelModule?: ImagePixelModule;
    imagePlaneModule?: ImagePlaneModule;
    origin?: Point3;
    spacing?: Point3;
  };
  needsRedraw?: boolean;
  options?: {
    [key: string]: unknown;
    colormap?: CPUFallbackColormap;
  };
  pan?: Point2;
  renderingTools?: CPUFallbackRenderingTools;
  rotation?: number;
  scale?: number;
  transform?: CPUFallbackTransform;
  viewport?: CPUFallbackViewport;
  zoom?: number;
}

export default CPUFallbackEnabledElement;
