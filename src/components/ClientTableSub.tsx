import React from 'react';

import { CLIENTSERIES } from '@/types/clientWithSeriesArray';

interface PROPS {
  selectedClientWithSeriesArrays: CLIENTSERIES[];
  // images: ArrayBuffer[];
  // setImages: React.Dispatch<React.SetStateAction<ArrayBuffer[]>>;
}

const ClientTableSub: React.FC<PROPS> = ({
  selectedClientWithSeriesArrays,
  // images,
  // setImages,
}) => {
  // const selectImages = async (clientWithSeriesArray: CLIENTSERIES) => {
  //   const imgs =
  //     clientWithSeriesArray.seriesArray?.map((s) => s.dicom as ArrayBuffer) ||
  //     [];
  //   setImages([...images, ...imgs]);
  // };

  return (
    <div>
      <div>
        <div>
          <span>ID</span>
          <span>{selectedClientWithSeriesArrays[0].id}</span>
        </div>
        <div>
          <span>名前</span>
          <span>{selectedClientWithSeriesArrays[0].name}</span>
        </div>
        <div>
          <span>ヨミ</span>
          <span>{selectedClientWithSeriesArrays[0].yomi}</span>
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
          {selectedClientWithSeriesArrays.map((c, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{c.DerivativeDiscription}</td>
              <td className="border px-4 py-2">{c.date}</td>
              <td className="border px-4 py-2">{c.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTableSub;
