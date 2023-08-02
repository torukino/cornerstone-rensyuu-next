import Link from 'next/link';

import { clientBySeriesUID } from '@/tools/gcp/clientBySeriesUID';
import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTSERIES } from '@/types/clients/clientWithSeriesArray';

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/retrieveInstances`,
  );
  const data = await response.json();
  const clientFlat: CLIENTFLAT[] = data.map((d: any) =>
    convertDicomTagsToJson(d),
  );
  const clientFlatWithSelectedId: CLIENTFLAT[] = clientFlat.filter(
    (c) => c.id === params.id,
  );
  const clientWithSeriesArray: CLIENTSERIES[] = await clientBySeriesUID(
    clientFlatWithSelectedId,
  );

  if (clientWithSeriesArray?.length === 0) return <div>no data</div>;
  return (
    <div>
      <div>
        <div>
          <span>ID</span>
          <span>{clientWithSeriesArray[0].id}</span>
        </div>
        <div>
          <span>名前</span>
          <span>{clientWithSeriesArray[0].name}</span>
        </div>
        <div>
          <span>ヨミ</span>
          <span>{clientWithSeriesArray[0].yomi}</span>
        </div>
      </div>

      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">内訳</th>
            <th className="px-4 py-2">作成日</th>
            <th className="px-4 py-2">年齢</th>
          </tr>
        </thead>
        <tbody>
          {clientWithSeriesArray.map((c, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">
                <Link
                  href={`/selectedData/${encodeURIComponent(
                    c.id + ':' + c.DerivativeDiscription + ':' + c.date,
                  )}`}
                >
                  {c.DerivativeDiscription}
                </Link>
              </td>
              <td className="border px-4 py-2">
                <Link
                  href={`/selectedData/${encodeURIComponent(
                    c.id + ':' + c.DerivativeDiscription + ':' + c.date,
                  )}`}
                >
                  {c.date}
                </Link>
              </td>
              <td className="border px-4 py-2">
                <Link
                  href={`/selectedData/${encodeURIComponent(
                    c.id + ':' + c.DerivativeDiscription + ':' + c.date,
                  )}`}
                >
                  {c.date}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
