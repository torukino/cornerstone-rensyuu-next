'use client';

import React from 'react';

import { clientBySeriesUID } from '@/tools/gcp/clientBySeriesUID';
import { CLIENTFLAT } from '@/types/clientFlat';
import { CLIENTUNIQUEID } from '@/types/clientUniqueId';
import { CLIENTSERIES } from '@/types/clientWithSeriesArray';

interface PROPS {
  clientFlat: CLIENTFLAT[];
  clientUniqueIds: CLIENTUNIQUEID[];
  setSelectedClientWithSeriesArrays: React.Dispatch<
    React.SetStateAction<CLIENTSERIES[]>
  >;
  // setIsGetImagesLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientTableMain: React.FC<PROPS> = ({
  clientFlat,
  clientUniqueIds,
  setSelectedClientWithSeriesArrays,
  // setIsGetImagesLoading,
}) => {
  async function retrieveStudy(
    studyUid: string,
    seriesUid: string,
    instanceUid: string,
  ): Promise<ArrayBuffer> {
    // Call the new API endpoint to get the auth token
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/authToken`,
    );
    const { token } = await tokenResponse.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/retrieveInstance?studyUid=${studyUid}&seriesUid=${seriesUid}&instanceUid=${instanceUid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const aB = await response.arrayBuffer();

    if (aB instanceof ArrayBuffer) {
      console.log('1 aB is an instance of ArrayBuffer');
    } else {
      console.log('1 aB is NOT an instance of ArrayBuffer');
    }

    return aB;
  }

  const selectClient = async (id?: string) => {
    const clientFlatWithSelectedId: CLIENTFLAT[] = clientFlat.filter(
      (c) => c.id === id,
    );
    const c: CLIENTSERIES[] = await clientBySeriesUID(clientFlatWithSelectedId);

    setSelectedClientWithSeriesArrays(c);
  }
    
   

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
        {clientUniqueIds.map((info, i) => (
          <tr key={i} onClick={() => selectClient(info.id)}>
            <td className="border px-4 py-2">{info.id}</td>
            <td className="border px-4 py-2">{info.name}</td>
            <td className="border px-4 py-2">{info.yomi}</td>
            <td className="border px-4 py-2">{info.gender}</td>
            <td className="border px-4 py-2">{info.age}</td>
            <td className="border px-4 py-2">{info.birthday}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientTableMain;
