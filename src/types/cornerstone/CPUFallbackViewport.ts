import CPUFallbackColormap from '@/types/cornerstone/CPUFallbackColormap';
import CPUFallbackLUT from '@/types/cornerstone/CPUFallbackLUT';
import CPUFallbackViewportDisplayedArea from '@/types/cornerstone/CPUFallbackViewportDisplayedArea';

type CPUFallbackViewport = {
  colormap?: CPUFallbackColormap;
  displayedArea?: CPUFallbackViewportDisplayedArea;
  focalPoint?: number[];
  hflip?: boolean;
  invert?: boolean;
  modality?: string;
  modalityLUT?: CPUFallbackLUT;
  parallelScale?: number;
  pixelReplication?: boolean;
  rotation?: number;
  scale?: number;
  translation?: {
    x: number;
    y: number;
  };
  vflip?: boolean;
  voi?: {
    windowCenter: number;
    windowWidth: number;
  };
  voiLUT?: CPUFallbackLUT;
};

export default CPUFallbackViewport;
