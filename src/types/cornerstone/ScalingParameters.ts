export type ScalingParameters = {
  /** m in m*p+b which specifies the linear transformation from stored pixels to memory value  */
  modality: string;
  /** b in m*p+b which specifies the offset of the transformation */
  rescaleIntercept: number;
  /** modality */
  rescaleSlope: number;
  /** SUV body weight */
  suvbsa?: number;
  /** SUV lean body mass */
  suvbw?: number;
  /** SUV body surface area */
  suvlbm?: number;
};

export type PTScaling = {
  /** suv body weight to suv lean body mass */
  suvbsa?: number;
  /** suv body weight to suv body surface area */
  suvbw?: number;
  /** SUV body weight */
  suvbwToSuvbsa?: number;
  /** SUV lean body mass */
  suvbwToSuvlbm?: number;
  /** SUV body surface area */
  suvlbm?: number;
};

export type Scaling = {
  PT?: PTScaling;
};
