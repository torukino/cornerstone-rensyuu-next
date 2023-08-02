import { NextApiRequest, NextApiResponse } from 'next';

import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { cloudRegion, datasetId, dicomStoreId, projectId } =
    getHealthcareSetting();

  const tokenResponse = await fetch('http://localhost:3000/api/authToken');
  const tokenData = await tokenResponse.json();
  const token = tokenData.token;
  const base = 'https://healthcare.googleapis.com/v1/';
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;
  const studyUid = req.query.studyUid as string;
  const seriesUid = req.query.seriesUid as string;
  const instanceUid = req.query.instanceUid as string;

  //https://cloud.google.com/healthcare-api/docs/reference/rest/v1/projects.locations.datasets.dicomStores.studies.series.instances/retrieveMetadata

  const dicomWebPath = `/dicomWeb/studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  const url = base + parent + dicomWebPath + '/metadata';
  // console.log('@@@@@@ url=', url);
  // console.log(`Bearer ${token}`);
  const options = {
    headers: {
      Accept: 'Accept: application/dicom; transfer-syntax=*',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'json',
  };

  try {
    const response = await fetch(url, options);
    const metadata = await response.json();
    console.log('@@@@@@ metadata=', JSON.stringify(metadata));
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
