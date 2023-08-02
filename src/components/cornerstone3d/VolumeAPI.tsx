'use client';
import React, { useEffect, useRef } from 'react';

import { initVolumeAPI } from '@/components/cornerstone3d/tools/volumeAPI';

const VolumeAPI = () => {
  const idName = 'VolumeAPI';
  const initialized = useRef(false);
  useEffect(() => {
    const run = async () => {
      const content = document.getElementById(idName + '-content');
      const content_ = document.getElementById('content');

      const toolbar = document.getElementById(idName + '-toolbar');
      if (content_ && content && toolbar) {
        content.innerHTML = '';
        toolbar.innerHTML = '';
        content_.innerHTML = '';
        await initVolumeAPI(idName);
      }
    };
    if (!initialized.current) {
      // ここで useRef の値をチェックします。
      run();
      initialized.current = true; // ここで useRef の値をセットします。
    }
  }, []);

  return (
    <div>
      <h1 id={`${idName}-title`} className="text-3xl"></h1>
      <p id={`${idName}-description`} className="text-xl text-blue-800"></p>
      <div
        id={`${idName}-toolbar`}
        className="grid w-1/3 grid-cols-4 gap-2"
      ></div>
      <div id={`${idName}-content`} className="items-center"></div>
      <div id={`content`} className="items-center"></div>
    </div>
  );
};

export default VolumeAPI;
