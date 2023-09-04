'use client';
import React, { useEffect } from 'react';

import { homeThree } from '@/tools/three/homeThree';

const HomeThree = () => {
  useEffect(() => {
  const canvas = document.querySelector('#webgl');
   canvas && homeThree(canvas);
  }, []);
  return <div>HomeThree</div>;
};

export default HomeThree;
