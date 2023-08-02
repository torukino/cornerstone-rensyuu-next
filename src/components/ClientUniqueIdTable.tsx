'use client';
import React, { useState } from 'react';

import ClientTableMain from '@/components/ClientTableMain';
import ClientTableSub from '@/components/ClientTableSub';
import DicomImageTest from '@/components/DicomImageTest';
import { CLIENTFLAT } from '@/types/clientFlat';
import { CLIENTUNIQUEID } from '@/types/clientUniqueId';
import { CLIENTSERIES } from '@/types/clientWithSeriesArray';

interface PROPS {
  clientFlat: CLIENTFLAT[];
  clientUniqueIds: CLIENTUNIQUEID[];
}

const ClientUniqueIdTable: React.FC<PROPS> = ({
  clientFlat,
  clientUniqueIds,
}) => {
  const [selectedClientWithSeriesArrays, setSelectedClientWithSeriesArrays] =
    useState<CLIENTSERIES[]>([]);

  return (
    <div>
      <ClientTableMain
        clientFlat={clientFlat}
        clientUniqueIds={clientUniqueIds}
        setSelectedClientWithSeriesArrays={setSelectedClientWithSeriesArrays}
      />

      {selectedClientWithSeriesArrays.length !== 0 && (
        <ClientTableSub
          selectedClientWithSeriesArrays={selectedClientWithSeriesArrays}
        />
      )}

      <DicomImageTest />
      <div className="flex flex-wrap">
        {/* {selectedClientWithSeriesArrays.length !== 0 &&
        selectedClientWithSeriesArrays.map(
          (selectedClientWithSeriesArray, i) => (
            <div key={i}>
              {selectedClientWithSeriesArray && (
                <DicomImage
                  selectedClientWithSeriesArray={selectedClientWithSeriesArray}
                />
              )}
            </div>
          ),
        )} */}
      </div>
    </div>
  );
};

export default ClientUniqueIdTable;
