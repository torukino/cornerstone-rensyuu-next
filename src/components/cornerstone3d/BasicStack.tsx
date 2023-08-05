'use client';

import React, { useEffect } from 'react';

import { initStackBasic } from '@/components/cornerstone3d/tools/stackBasic';

interface PROPS {
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasic: React.FC<PROPS> = ({
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'stackBasic';
  const run = async (SeriesInstanceUID: string, StudyInstanceUID: string) => {
    await initStackBasic(idName, SeriesInstanceUID, StudyInstanceUID);
  };
  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID) {
      run(SeriesInstanceUID, StudyInstanceUID);
    }
    return () => {
      const element = document.getElementById(`${idName}-content`);
      if (element) {
        element.innerHTML = '';
      }
    };
  }, [SeriesInstanceUID, StudyInstanceUID]);
  return (
    <div>
      <h1 id={`${idName}-title`} className="text-3xl"></h1>
      <p id={`${idName}-description`} className="text-xl text-blue-800"></p>
      <div id={`${idName}-content`} className="items-center"></div>
    </div>
  );
};

export default StackBasic;
