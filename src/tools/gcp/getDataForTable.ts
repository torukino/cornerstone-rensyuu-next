import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';

export const getUrlForTable = () => {
  const { cloudRegion, datasetId, dicomStoreId, projectId } =
    getHealthcareSetting();
  const prefixUrl = 'https://healthcare.googleapis.com/v1/projects/';
  const coreUrl = `${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}/`;
  const postfixUrl = 'dicomWeb/instances';
  const url = prefixUrl + coreUrl + postfixUrl;
  return url;
};
