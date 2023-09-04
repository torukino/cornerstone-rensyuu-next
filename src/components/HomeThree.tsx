'use client';
import React, { useEffect } from 'react';

import { earthThree } from '@/tools/three/earthThree';

const HomeThree = () => {
  useEffect(() => {
    const canvas: HTMLElement | null = document.getElementById('webgl');
    if (canvas) {
      // homeThree(canvas);
      earthThree(canvas);
    }
    return () => {
      const canvas = document.getElementById('webgl');
      if (canvas) {
        canvas.innerHTML = '';
      }
    };
  }, []);
  return (
    <canvas
      id="webgl"
      className="h-full w-full bg-cover bg-center bg-no-repeat"
    ></canvas>
  );
};

export default HomeThree;
