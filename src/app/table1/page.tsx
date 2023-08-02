import Link from 'next/link';

import { convertAllClientFlatToClientUniqueById } from '@/tools/gcp/convertAllClientFlatToClientUniqueById';
import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTUNIQUEID } from '@/types/clients/clientUniqueId';


export default async function Table1() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/retrieveInstances`,
  );
  const data = await response.json();
  const clientFlat: CLIENTFLAT[] = data.map((d: any) =>
    convertDicomTagsToJson(d),
  );
  const clientUniqueIds: CLIENTUNIQUEID[] =
    convertAllClientFlatToClientUniqueById(clientFlat);
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">名前</th>
          <th className="px-4 py-2">ヨミ</th>
          <th className="px-4 py-2">性別</th>
          <th className="px-4 py-2">年齢</th>
          <th className="px-4 py-2">誕生日</th>
        </tr>
      </thead>
      <tbody>
        {clientUniqueIds.map((info: CLIENTUNIQUEID, i: number) => (
          <tr key={i}>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.id}</Link>
            </td>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.name}</Link>
            </td>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.yomi}</Link>
            </td>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.gender}</Link>
            </td>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.age}</Link>
            </td>
            <td className="border px-4 py-2">
              <Link href={`/image/${info.id}`}>{info.birthday}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
