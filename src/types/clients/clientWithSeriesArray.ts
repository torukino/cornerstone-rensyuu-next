export interface CLIENTSERIES {
  id: string;
  name: string;
  age?: string;
  birthday?: string;
  date?: string;
  DerivativeDiscription?: string;
  gender?: string;
  No?: string;
  seriesArray?: SERIES[];
  time?: string;
  type?: string;
  yomi?: string;
}

export interface SERIES {
  dicom?: ArrayBuffer;
  InstanceUID?: string;
  SeriesInstanceUID?: string;
  SeriesNumber?: string;
  SOPInstanceUID?: string;
  StudyInstanceUID?: string;
}
