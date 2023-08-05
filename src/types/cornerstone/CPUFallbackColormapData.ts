import Point4 from './Point4';

type CPUFallbackColormapData = {
  name: string;
  colors?: Point4[];
  gamma?: number;
  numColors?: number;
  numOfColors?: number;
  segmentedData?: unknown;
};

export default CPUFallbackColormapData;
