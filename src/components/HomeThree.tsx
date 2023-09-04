'use client';
import React, { useEffect } from 'react';

import { earth } from '@/tools/three/earth';

const HomeThree = () => {
  useEffect(() => {
  const canvas = document.querySelector('#webgl');
  //  canvas && homeThree(canvas);
   canvas && earth(canvas);
  }, []);
  return <div>HomeThree</div>;
};

export default HomeThree;
