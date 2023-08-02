'use client';

import React, { useEffect, useRef } from 'react';

import { initStackVOISigmoid } from '@/components/cornerstone3d/tools/stackVOISigmoid';

const StackVOISigmoid = () => {
  const idName = 'StackVOISigmoid';
  const initialized = useRef(false);
  useEffect(() => {
    const run = async () => {
      await initStackVOISigmoid(idName);
    };
    if (!initialized.current) {
      run();
      initialized.current = true;
    }
  }, []);

  return (
    <div>
      <h1 id={`${idName}-title`} className="text-3xl"></h1>
      <p id={`${idName}-description`} className="text-xl text-blue-800"></p>
      <div
        id={`${idName}-toolbar`}
        className="grid w-1/3 grid-cols-2 gap-2"
      ></div>
      <div id={`${idName}-content`} className="items-center"></div>
    </div>
  );
};

export default StackVOISigmoid;
