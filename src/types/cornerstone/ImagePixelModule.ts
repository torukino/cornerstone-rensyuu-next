import VOILUTFunctionType from '@/enums/cornerstone/VOILUTFunctionType';

export interface ImagePixelModule {
  bitsAllocated: number;
  bitsStored: number;
  highBit: number;
  modality: string;
  photometricInterpretation: string;
  pixelRepresentation: string;
  samplesPerPixel: number;
  voiLUTFunction: VOILUTFunctionType;
  windowCenter: number | number[];
  windowWidth: number | number[];
}
