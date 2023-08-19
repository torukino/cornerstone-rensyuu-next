export interface CLIENTSERIES {
  id: string;
  name: string;
  age?: string;
  birthday?: string;
  date?: string;
  DerivativeDiscription?: string;
  gender?: string;
  instituteName?: string;
  No?: string;
  seriesArray?: SERIES[];
  time?: string;
  type?: string;
  yomi?: string;
}

export interface SERIES {
  dicom?: ArrayBuffer;
  imagePositionPatient?: string;
  InstanceUID?: string;
  SeriesInstanceUID?: string;
  SeriesNumber?: string;
  sliceLocation?: string;
  SOPInstanceUID?: string;
  StudyInstanceUID?: string;
}

export const initClientWithSeries = {
  id: '',
  name: '',
  age: '',
  birthday: '',
  date: '',
  DerivativeDiscription: '',
  gender: '',
  No: '',
  seriesArray: [],
  time: '',
  type: '',
  yomi: '',
};
