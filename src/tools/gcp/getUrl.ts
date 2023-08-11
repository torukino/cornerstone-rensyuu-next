import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';
import { CLIENTFLAT } from '@/types/clients/clientFlat';

export const getUrl = (c: CLIENTFLAT) => {
  const { cloudRegion, datasetId, dicomStoreId, projectId } =
    getHealthcareSetting();
  const studyUid = c.StudyInstanceUID;
  const seriesUid = c.SeriesInstanceUID;
  const instanceUid = c.SOPInstanceUID;

  const baseUrl = 'https://healthcare.googleapis.com/v1';
  const healthCareUrl = `/projects/${projectId}/locations/${cloudRegion}`;
  const dicomStorePath = `/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
  const dicomwebPath = `/dicomWeb/studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  return baseUrl + healthCareUrl + dicomStorePath + dicomwebPath;
};
