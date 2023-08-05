import TableClient from '@/app/cornerstone/tableClient/TableClient';
import { clientBySeriesUID } from '@/tools/gcp/clientBySeriesUID';
import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTSERIES } from '@/types/clients/clientWithSeries';

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
        <TableClient clientWithSeriesArray={clientWithSeriesArray} />
      </div>
    </div>
  );
}
