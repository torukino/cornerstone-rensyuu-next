'use client';

import React, { useEffect } from 'react';

import { initStackEvents } from '@/components/cornerstone3d/tools/stackEvents';

const StackEvents = () => {
  const idName = 'stackEvents';
  useEffect(() => {
    const run = async () => {
      const content = document.getElementById(idName + '-content');
      const toolbar = document.getElementById(idName + '-toolbar');
      if (content && toolbar) {
        content.innerHTML = '';
        toolbar.innerHTML = '';
        await initStackEvents(idName);
      }
    };
    run();
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
    </div>
  );
};

export default StackEvents;
