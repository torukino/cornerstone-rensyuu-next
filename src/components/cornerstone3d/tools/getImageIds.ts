import createImageIdsAndCacheMetaData from '@/tools/cornerstoneTools/createImageIdsAndCacheMetaData';

export const getImageIds = async (gcp: boolean): Promise<string[]> => {
  const imageIds = await createImageIdsAndCacheMetaData({
    gcp,
    SeriesInstanceUID:
      '1.2.840.113619.2.388.10502719.2140785.15434.1666568329.907',
    StudyInstanceUID:
      '1.2.840.113619.6.388.264539096114033263069777858756428804823',
    wadoRsRoot:
      'https://healthcare.googleapis.com/v1/projects/dicom-rensyuu/locations/asia-northeast1/datasets/ohif-dataset/dicomStores/ohif-datastore/dicomWeb',
  });

  return imageIds;
};
