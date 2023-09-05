'use client';
import React, { useEffect } from 'react';

import { earthThreeRyo } from '@/tools/three/earthThreeRyo';

const HomeThreeRyo = () => {
  useEffect(() => {
    const canvas: HTMLElement | null = document.getElementById('webgl');
    if (canvas) {
      // homeThree(canvas);
      earthThreeRyo(canvas);
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
      className="absolute left-0 top-0 h-full w-full bg-cover bg-center bg-no-repeat"
    ></canvas>
  );
};

export default HomeThreeRyo;
