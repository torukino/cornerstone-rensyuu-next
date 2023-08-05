import ClientUniqueIdTable from '@/components/ClientUniqueIdTable';
import { convertAllClientFlatToClientUniqueById } from '@/tools/gcp/convertAllClientFlatToClientUniqueById';
import { convertDicomTagsToJson } from '@/tools/gcp/convertDicomTagsToJson';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTUNIQUEID } from '@/types/clients/clientUniqueId';

export const Table = async () => {
  // Call the new API endpoint to get the auth token
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
    <div>
      <ClientUniqueIdTable
        clientFlat={clientFlat}
        clientUniqueIds={clientUniqueIds}
      />
    </div>
  );
};

export default Table;
