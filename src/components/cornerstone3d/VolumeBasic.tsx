'use client';

import React, { useEffect } from 'react';

import { initVolumeBasic } from '@/components/cornerstone3d/tools/volumeBasic';

interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const VolumeBasic: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'VolumeBasic';
  const run = async (
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
  ) => {
    await initVolumeBasic(
      idName,
      SeriesInstanceUID,
      StudyInstanceUID,
      DerivativeDiscription,
    );
  };

  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID && DerivativeDiscription) {
      run(SeriesInstanceUID, StudyInstanceUID, DerivativeDiscription);
    }
    return () => {
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
    };
  }, [SeriesInstanceUID, StudyInstanceUID, DerivativeDiscription]);

  return (
    <div>
      <h1 id={`${idName}-title`} className="text-3xl"></h1>
      <p id={`${idName}-description`} className="text-xl text-blue-800"></p>
      <div
        id={`${idName}-toolbar`}
        className="grid w-1/3 grid-cols-4 gap-2"
      ></div>
      <div
        id={`${idName}-content`}
        className="items-center bg-blue-500"
        style={{ height: '500px', width: '100%' }}
      ></div>
    </div>
  );
};

export default VolumeBasic;
