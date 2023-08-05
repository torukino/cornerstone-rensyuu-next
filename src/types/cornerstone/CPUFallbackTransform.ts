import Point2 from '@/types/cornerstone/Point2';
import TransformMatrix2D from '@/types/cornerstone/TransformMatrix2D';

interface CPUFallbackTransform {
  clone: () => CPUFallbackTransform;
  getMatrix: () => TransformMatrix2D;
  invert: () => void;
  multiply: (matrix: TransformMatrix2D) => void;
  reset: () => void;
  rotate: (rad: number) => void;
  scale: (sx: number, sy: number) => void;
  transformPoint: (point: Point2) => Point2;
  translate: (x: number, y: number) => void;
}

export default CPUFallbackTransform;
