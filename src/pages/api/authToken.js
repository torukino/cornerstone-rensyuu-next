import fs from 'fs';
import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  // JSONファイルから認証情報を読み込む
  // rootのdicom_rensyuu.jsonをfs.readFileSyncで読みrawCredentialsに格納
  const rawCredentials = fs.readFileSync('dicom-rensyuu.json');
  const credentials = JSON.parse(rawCredentials.toString());

  // Google認証クライアントを作成
  const client = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  // OAuth2トークンを取得
  const authToken = (await client.getAccessToken()) || '';
  // console.log('@@@@@@@@@@@authToken', JSON.stringify(authToken));
  // トークンをレスポンスとして返す
  res.status(200).json({ token: authToken });
}
