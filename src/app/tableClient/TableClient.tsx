'use client';

import { RenderingEngine } from '@cornerstonejs/core';
import React, { useEffect, useState } from 'react';

import ViewStackMini from '@/components/cornerstone3d/ViewStackMini';
import ViewVolume from '@/components/cornerstone3d/ViewVolume';
import { initDemo } from '@/tools/cornerstoneTools';
import { CLIENTSERIES } from '@/types/clients/clientWithSeries';

interface PROPS {
  clientWithSeriesArray: CLIENTSERIES[];
}
const TableClient: React.FC<PROPS> = ({ clientWithSeriesArray }) => {
  const [SeriesInstanceUID, setSeriesInstanceUID] = useState<string>('');
  const [StudyInstanceUID, setStudyInstanceUID] = useState<string>('');
  const [DerivativeDiscription, setDerivativeDiscription] =
    useState<string>('');
  const [renderingEngine, setRenderingEngine] = useState<
    RenderingEngine | undefined
  >(undefined);

  const setRenderEngine = async () => {
    const gcp = true;
    await initDemo(gcp);
    const renderingEngineId = 'RenderingEngineId';
    setRenderingEngine(new RenderingEngine(renderingEngineId));
  };

  useEffect(() => {
    setRenderEngine();
  }, []);

  const selectImage = (c: CLIENTSERIES) => {
    console.log(
      `${c.id} ${c.name} DerivativeDiscription:${c.DerivativeDiscription}`,
    );
    setSeriesInstanceUID('');
    setStudyInstanceUID('');
    setDerivativeDiscription('');
    if (
      c &&
      c.seriesArray &&
      c.seriesArray.length > 0 &&
      c.seriesArray[0] &&
      c.seriesArray[0].SeriesInstanceUID &&
      c.seriesArray[0].StudyInstanceUID
      // c.DerivativeDiscription
    ) {
      setSeriesInstanceUID(c.seriesArray[0].SeriesInstanceUID);
      setStudyInstanceUID(c.seriesArray[0].StudyInstanceUID);
      c.DerivativeDiscription &&
        setDerivativeDiscription(c.DerivativeDiscription);
      c.instituteName && setDerivativeDiscription(c.instituteName);
    }
  };

  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">内訳</th>
            <th className="px-4 py-2">作成日</th>
            <th className="px-4 py-2">画像</th>
          </tr>
        </thead>
        <tbody>
          {renderingEngine &&
            clientWithSeriesArray &&
            clientWithSeriesArray.length > 0 &&
            clientWithSeriesArray.map((clientWithSeries, index) => (
              <tr key={index} onClick={() => selectImage(clientWithSeries)}>
                <td className="border px-4 py-2">
                  <p>{clientWithSeries.DerivativeDiscription}</p>
                </td>
                <td className="border px-4 py-2">
                  <p>{clientWithSeries.date}</p>
                </td>
                <td className="border px-4 py-2">
                  <p>{clientWithSeries.age}</p>
                </td>

                <td className="border px-4 py-2">
                  {clientWithSeries.seriesArray &&
                    clientWithSeries.seriesArray.length > 0 && (
                      <ViewStackMini
                        index={index}
                        renderingEngine={renderingEngine}
                        SeriesInstanceUID={
                          clientWithSeries.seriesArray[0].SeriesInstanceUID
                        }
                        StudyInstanceUID={
                          clientWithSeries.seriesArray[0].StudyInstanceUID
                        }
                        DerivativeDiscription={
                          clientWithSeries.DerivativeDiscription
                        }
                      />
                    )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {renderingEngine && SeriesInstanceUID && StudyInstanceUID && (
        <div className="flex flex-col">
          {/* <ViewStackSegment
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          /> */}
          {/* <ViewSegment
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          /> */}
          {/* <div id="viewVolume">
            <VolumeBasic
              SeriesInstanceUID={SeriesInstanceUID}
              StudyInstanceUID={StudyInstanceUID}
              DerivativeDiscription={DerivativeDiscription}
            />
          </div> */}

          <ViewVolume
            renderingEngine={renderingEngine}
            SeriesInstanceUID={SeriesInstanceUID}
            StudyInstanceUID={StudyInstanceUID}
            DerivativeDiscription={DerivativeDiscription}
          />
          {/* <ViewStack
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
