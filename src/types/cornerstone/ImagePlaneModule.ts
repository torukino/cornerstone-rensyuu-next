import Point2 from '@/types/cornerstone/Point2';
import Point3 from '@/types/cornerstone/Point3';

export interface ImagePlaneModule {
  columnCosines?: Point3;
  columnPixelSpacing?: number;
  columns: number;
  frameOfReferenceUID: string;
  imageOrientationPatient?: Float32Array;
  imagePositionPatient?: Point3;
  pixelSpacing?: Point2;
  rowCosines?: Point3;
  rowPixelSpacing?: number;
  rows: number;
  sliceLocation?: number;
  sliceThickness?: number;
}
