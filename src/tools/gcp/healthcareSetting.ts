export const getHealthcareSetting = (): {
  cloudRegion: string;
  datasetId: string;
  dicomStoreId: string;
  projectId: string;
} => {
  const projectId = 'dicom-rensyuu';
  const cloudRegion = 'asia-northeast1';
  const datasetId = 'ohif-dataset';
  const dicomStoreId = 'ohif-datastore';

  return {
    cloudRegion: cloudRegion,
    datasetId: datasetId,
    dicomStoreId: dicomStoreId,
    projectId: projectId,
  };
};
