import { promises as fs } from 'fs';
import { healthcare } from 'googleapis/build/src/apis/healthcare';
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
  const fileName = 'public/' + instanceUid + '.dcm';
  const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  const request = { dicomWebPath, parent };

  const url = base + parent + '/dicomWeb/' + dicomWebPath + '/rendered';
  console.log('@@@@@@ url=', url);
  console.log(`Bearer ${token}`);

  try {
    const instance =
      await healthcare.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(
        request,
        {
          headers: { Accept: 'application/dicom; transfer-syntax=*' },
          responseType: 'arraybuffer',
        },
      );
    const fileBytes = Buffer.from(instance.data);

    await fs.writeFile(fileName, fileBytes);
    console.log(
      `Retrieved DICOM instance and saved to ${fileName} in current directory`,
    );
    res.setHeader('Content-Type', 'application/dicom');
    res.status(200).send(fileBytes);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
