import * as dicomParser from 'dicom-parser';

export const convertArrayBufferToDicomFile = (aB: ArrayBuffer) => {
  try {
    const u8A = new Uint8Array(aB);
    const ds = dicomParser.parseDicom(u8A);
    console.log('The dataSet　氏名:', ds.string('x00100010'));
    return ds;
    // Here, you can use the 'dataSet' object to access your DICOM data.
  } catch (err) {
    console.log('Error parsing DICOM data: ', err);
  }
};
