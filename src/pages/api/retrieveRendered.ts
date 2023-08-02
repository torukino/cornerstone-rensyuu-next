import { writeFile } from 'fs';
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
  const dicomWebPath = `/dicomWeb/studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
  const url = base + parent + dicomWebPath + '/rendered';
  console.log('@@@@@@ url=', url);
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
    const rendered = await response.arrayBuffer();
    const fileBytes = Buffer.from(rendered);

    await writeFile(fileName, fileBytes, (err) => {
      // 書き出しに失敗した場合
      if (err) {
        console.log('エラーが発生しました。' + err);
        res.status(500).json({ error: '書き出しに失敗' });
        throw err;
      }
      // 書き出しに成功した場合
      else {
        console.log('ファイルが正常に書き出しされました');
      }
    });
    res.status(200).send(Buffer.from(rendered));
  } catch (error) {
    res.status(500).json({ error: 'Error calling Google Healthcare API' });
  }
}
