import { writeFile } from 'fs/promises';
import { google } from 'googleapis';

import { getHealthcareSetting } from '@/tools/gcp/healthcareSetting';

const healthcare = google.healthcare({
  auth: new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  }),
  version: 'v1',
});
export default async function handler(
  req, res) {
  const { cloudRegion, datasetId, dicomStoreId, projectId } =
    getHealthcareSetting();

  const tokenResponse = await fetch('http://localhost:3000/api/authToken');
  const tokenData = await tokenResponse.json();
  const token = tokenData.token;
  const base = 'https://healthcare.googleapis.com/v1/';
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

  const studyUid = req.query.studyUid;
  const seriesUid = req.query.seriesUid;
  const instanceUid = req.query.instanceUid;
  const fileName = 'public/dicom/' + instanceUid + '.dcm';

  const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  const request = { dicomWebPath, parent };

  const url = base + parent + '/dicomWeb/' + dicomWebPath;
  console.log('@@@@@@ url=', url + "/rendered");
  console.log(`Bearer ${token}`);

  const options = {
    headers: {
      Accept: 'application/dicom; transfer-syntax=*',
      Authorization: `Bearer ${token}`,
    },
     responseType: 'arraybuffer',
  };

  try {
    const response = await fetch(url, options);
    const instance = await response.arrayBuffer();
    const fileBytes = Buffer.from(instance.data);

    await writeFile(fileName, fileBytes);
    console.log(
      `Retrieved DICOM instance and saved to ${fileName} in current directory`,
    );
    res.setHeader('Content-Type', 'application/dicom');
    res.status(200).send(fileBytes);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
