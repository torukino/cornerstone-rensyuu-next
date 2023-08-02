'use client';

import React, { useEffect, useRef } from 'react';

import { initStackBasic } from '@/components/cornerstone3d/tools/stackBasic';

const StackBasic = () => {
  const idName = 'stackBasic';
  const initialized = useRef(false);

  useEffect(() => {
    const run = async () => {
      await initStackBasic(idName);
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
      <div id={`${idName}-content`} className="items-center"></div>
    </div>
  );
};

export default StackBasic;
