import CPUFallbackLookupTable from '@/types/cornerstone/CPUFallbackLookupTable';
import Point4 from '@/types/cornerstone/Point4';

interface CPUFallbackColormap {
  /** Get id of colormap */
  addColor: (rgba: Point4) => void;
  buildLookupTable: (lut: CPUFallbackLookupTable) => void;
  clearColors: () => void;
  createLookupTable: () => CPUFallbackLookupTable;
  getColor: (index: number) => Point4;
  getColorRepeating: (index: number) => Point4;
  getColorSchemeName: () => string;
  getId: () => string;
  getNumberOfColors: () => number;
  insertColor: (index: number, rgba: Point4) => void;
  isValidIndex: (index: number) => boolean;
  removeColor: (index: number) => void;
  setColor: (index: number, rgba: Point4) => void;
  setColorSchemeName: (name: string) => void;
  setNumberOfColors: (numColors: number) => void;
}

export default CPUFallbackColormap;
