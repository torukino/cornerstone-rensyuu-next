'use client';
import React, { useEffect } from 'react';

import { runMain } from '@/components/cornerstone3d/rensyuuTools/runMain';

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasicBetauchiToru: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'viewStack';
  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID) {
      runMain(
        idName,
        SeriesInstanceUID,
        StudyInstanceUID,
        DerivativeDiscription,
      );
    }
    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
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
          id={`${idName}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div id={`${idName}-content`} className=" items-center"></div>
      </div>
    </div>
  );
};

export default StackBasicBetauchiToru;
