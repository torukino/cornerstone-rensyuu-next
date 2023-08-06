import createImageIdsAndCacheMetaData from '@/tools/cornerstoneTools/createImageIdsAndCacheMetaData';

export const getImageIds = async (
  gcp: boolean,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
): Promise<string[]> => {
  const imageIds = await createImageIdsAndCacheMetaData({
    gcp,
    SeriesInstanceUID: SeriesInstanceUID,
    StudyInstanceUID: StudyInstanceUID,
    wadoRsRoot:
      'https://healthcare.googleapis.com/v1/projects/dicom-rensyuu/locations/asia-northeast1/datasets/ohif-dataset/dicomStores/ohif-datastore/dicomWeb',
  });

  return imageIds;
};
