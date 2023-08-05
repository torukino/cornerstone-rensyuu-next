'use client';

import React, { useEffect } from 'react';

import { initStackBasic } from '@/components/cornerstone3d/tools/stackBasic';

interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasic: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'stackBasic';
  const run = async (
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
  ) => {
    await initStackBasic(
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
    <div className="mb-10 ml-10">
      <h1 id={`${idName}-title`} className="text-3xl"></h1>
      <p id={`${idName}-description`} className="text-xl text-blue-800"></p>
      <div id={`${idName}-toolbar`} className="justify-between text-blue-500"></div>
      <div id={`${idName}-content`} className="items-center"></div>
    </div>
  );
};

export default StackBasic;
