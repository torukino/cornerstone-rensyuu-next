import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { CLIENTFLAT } from '@/types/clients/clientFlat';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params || !params.id) {
    console.error('No params or params.id is missing');
    return <div>no params</div>;
  }

  const data_ = decodeURIComponent(params.id);
  const [id, DerivativeDiscription, date] = data_
    .split(':')
    .map((item) => item || '');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/retrieveInstances`,
  );
  if (!response.ok) {
    console.error(`Error fetching instances: ${response.statusText}`);
    return <div>Error fetching instances</div>;
  }

  const data = await response.json();
  const clientFlat: CLIENTFLAT[] = data.map((d: any) =>
    convertDicomTagsToJson(d),
  );

  // Filter clientFlat by id, DerivativeDiscription, date and store in focusedClientArray
  const focusedArray: CLIENTFLAT[] = clientFlat.filter((client) => {
    return (
      client.id === id &&
      client.DerivativeDiscription === DerivativeDiscription &&
      client.date === date
    );
  });

  if (focusedArray.length === 0) {
    console.error('No data matched the given criteria');
    return <div>no data</div>;
  }

  return (
    <div>
      {focusedArray.map((client, index) => (
        <div key={index}>
          <span>{client.id}</span>
          <span>{client.name}</span>
          <span>{client.SOPInstanceUID}</span>
          <span>{client.DerivativeDiscription}</span>
          <span>{client.date}</span>
          <div>
            <div>SeriesInstanceUID</div>
            <div>{client.SeriesInstanceUID}</div>
            <div>StudyInstanceUID</div>
            <div>{client.StudyInstanceUID}</div>
          </div>
          <br />
        </div>
      ))}
      {/* <div>
        <DicomImage selectedClient={focusedArray[0]} />
      </div> */}
    </div>
  );
}
