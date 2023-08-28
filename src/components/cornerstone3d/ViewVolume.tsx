'use client';
import React, { useEffect, useState } from 'react';

import { runMainVolume3DHair } from '@/components/cornerstone3d/rensyuuTools/runMainVolume3DHair';

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const ViewVolume: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idNamePrefix = 'viewVolume';
  const [idName3D, setIdName3D] = useState<string>(idNamePrefix);

  const [hasRunMap, setHasRunMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('SeriesInstanceUID', SeriesInstanceUID);
    console.log('StudyInstanceUID', StudyInstanceUID);
    const key = `${SeriesInstanceUID}-${StudyInstanceUID}`;
    if (!hasRunMap[key] && SeriesInstanceUID && StudyInstanceUID) {
      runMainVolume3DHair(
        idName3D,
        SeriesInstanceUID,
        StudyInstanceUID,
        DerivativeDiscription,
      );
      console.log('in runMainVolume3DHair');
      setHasRunMap((prev) => ({ ...prev, [key]: true }));
    }

    return () => {
      const content = document.getElementById(`${setIdName3D}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName3D}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID]);

  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>

      <div>
        <div
          id={`${idName3D}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div id={`${idName3D}-content`} className=" items-center"></div>
      </div>
    </div>
  );
};

export default ViewVolume;
