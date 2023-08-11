'use client';

import React, { useState } from 'react';

import StackBasicBetauchiToru from '@/components/cornerstone3d/BasicStackBetauchiToru';
import { CLIENTSERIES } from '@/types/clients/clientWithSeries';

interface PROPS {
  clientWithSeriesArray: CLIENTSERIES[];
}
const TableClient: React.FC<PROPS> = ({ clientWithSeriesArray }) => {
  const [SeriesInstanceUID, setSeriesInstanceUID] = useState<string>('');
  const [StudyInstanceUID, setStudyInstanceUID] = useState<string>('');
  const [DerivativeDiscription, setDerivativeDiscription] =
    useState<string>('');

  const selectImage = (c: CLIENTSERIES) => {
    console.log(`${c.id} ${c.name} ${c.DerivativeDiscription}`);
    setSeriesInstanceUID('');
    setStudyInstanceUID('');
    setDerivativeDiscription('');
    if (
      c &&
      c.seriesArray &&
      c.seriesArray.length > 0 &&
      c.seriesArray[0] &&
      c.seriesArray[0].SeriesInstanceUID &&
      c.seriesArray[0].StudyInstanceUID &&
      c.DerivativeDiscription
    ) {
      setSeriesInstanceUID(c.seriesArray[0].SeriesInstanceUID);
      setStudyInstanceUID(c.seriesArray[0].StudyInstanceUID);
      setDerivativeDiscription(c.DerivativeDiscription);
    }
  };

  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">内訳</th>
            <th className="px-4 py-2">作成日</th>
            <th className="px-4 py-2">年齢</th>
          </tr>
        </thead>
        <tbody>
          {clientWithSeriesArray.map((clientWithSeries, i) => (
            <tr key={i} onClick={() => selectImage(clientWithSeries)}>
              <td className="border px-4 py-2">
                <p>{clientWithSeries.DerivativeDiscription}</p>
              </td>
              <td className="border px-4 py-2">
                <p>{clientWithSeries.date}</p>
              </td>
              <td className="border px-4 py-2">
                <p>{clientWithSeries.age}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {SeriesInstanceUID && StudyInstanceUID && (
        <div>
          {/* <StackBasic
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          /> */}
          {/* <StackAPI
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          /> */}
          <StackBasicBetauchiToru
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          />

          {/* <VolumeBasic
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          /> */}
        </div>
      )}
    </div>
  );
};

export default TableClient;
