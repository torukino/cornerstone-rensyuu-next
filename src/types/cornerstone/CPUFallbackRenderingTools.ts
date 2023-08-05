import CPUFallbackLookupTable from '@/types/cornerstone/CPUFallbackLookupTable';
import CPUFallbackLUT from '@/types/cornerstone/CPUFallbackLUT';

type CPUFallbackRenderingTools = {
  colorLUT?: CPUFallbackLookupTable;
  colormapId?: string;
  lastRenderedImageId?: string;
  lastRenderedIsColor?: boolean;
  lastRenderedViewport?: {
    colormap: unknown;
    hflip: boolean;
    invert: boolean;
    modalityLUT: CPUFallbackLUT;
    rotation: number;
    vflip: boolean;
    voiLUT: CPUFallbackLUT;
    windowCenter: number | number[];
    windowWidth: number | number[];
  };
  renderCanvas?: HTMLCanvasElement;
  renderCanvasContext?: CanvasRenderingContext2D;
  renderCanvasData?: ImageData;
};

export default CPUFallbackRenderingTools;
