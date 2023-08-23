import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

dotenv.config();

export default async function handler(req, res) {
  // 環境変数から認証情報を読み込む
  const credentials = {
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    auth_uri: process.env.AUTH_URI,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    private_key_id: process.env.PRIVATE_KEY_ID,
    project_id: process.env.PROJECT_ID,
    token_uri: process.env.TOKEN_URI,
    type: process.env.TYPE,
  };

  // Google認証クライアントを作成
  const client = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  // OAuth2トークンを取得
  const authToken = (await client.getAccessToken()) || '';
  // トークンをレスポンスとして返す
  res.status(200).json({ token: authToken });
}
