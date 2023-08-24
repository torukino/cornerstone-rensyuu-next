import { NextApiRequest, NextApiResponse } from 'next';

import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { cloudRegion, datasetId, dicomStoreId, projectId } =
    getHealthcareSetting();

  const tokenResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/authToken`,
  );
  const tokenData = await tokenResponse.json();
  const base = 'https://healthcare.googleapis.com/v1/';
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}/`;
  const dicomWebPath = 'dicomWeb/instances';
  const url = base + parent + dicomWebPath;
  const token = tokenData.token;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/json; charset=utf-8',
      'Content-Type': 'application/dicom+json',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
