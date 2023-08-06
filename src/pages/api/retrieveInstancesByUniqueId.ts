import { NextApiRequest, NextApiResponse } from 'next';

import { convertAllClientFlatToClientUniqueById } from '@/tools/gcp/convertAllClientFlatToClientUniqueById';
import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTUNIQUEID } from '@/types/clients/clientUniqueId';

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
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  try {
    const response = await fetch(url, options);

    const data = await response.json();
    const clientFlat: CLIENTFLAT[] = data.map((d: any) =>
      convertDicomTagsToJson(d),
    );
    const clientUniqueIds: CLIENTUNIQUEID[] =
      convertAllClientFlatToClientUniqueById(clientFlat);

    res.status(200).json(clientUniqueIds);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
