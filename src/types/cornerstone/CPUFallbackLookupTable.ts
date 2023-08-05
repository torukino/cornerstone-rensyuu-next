import Point4 from '@/types/cornerstone/Point4';

interface CPUFallbackLookupTable {
  build: (force: boolean) => void;
  getColor: (scalar: number) => Point4;
  setAlphaRange: (start: number, end: number) => void;
  setHueRange: (start: number, end: number) => void;
  setNumberOfTableValues: (number: number) => void;
  setRamp: (ramp: string) => void;
  setRange: (start: number, end: number) => void;
  setSaturationRange: (start: number, end: number) => void;
  setTableRange: (start: number, end: number) => void;
  setValueRange: (start: number, end: number) => void;
  setTableValue(index: number, rgba: Point4): void;
}

export default CPUFallbackLookupTable;
