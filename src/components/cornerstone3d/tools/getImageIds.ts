import createImageIdsAndCacheMetaData from '@/tools/cornerstoneTools/createImageIdsAndCacheMetaData';
import { CLIENTFLAT } from '@/types/clients/clientFlat';

export const getImageIds = async (
  gcp: boolean,
  clientFlat: CLIENTFLAT,
): Promise<string[]> => {
  const SeriesInstanceUID = clientFlat.SeriesInstanceUID;
  const StudyInstanceUID = clientFlat.StudyInstanceUID;

  const imageIds = await createImageIdsAndCacheMetaData({
    gcp,
    SeriesInstanceUID: SeriesInstanceUID,
    // '1.2.840.113619.2.388.10502719.2140785.15434.1666568329.907',
    StudyInstanceUID: StudyInstanceUID,
    // '1.2.840.113619.6.388.264539096114033263069777858756428804823',
    wadoRsRoot:
      'https://healthcare.googleapis.com/v1/projects/dicom-rensyuu/locations/asia-northeast1/datasets/ohif-dataset/dicomStores/ohif-datastore/dicomWeb',
  });

  return imageIds;
};
