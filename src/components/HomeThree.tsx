'use client';
import React, { useEffect } from 'react';

import { earthThree } from '@/tools/three/earthThree';
import { homeThree } from '@/tools/three/homeThree';

const HomeThree = () => {
  useEffect(() => {
    const canvas1: HTMLElement | null = document.getElementById('webgl1');
    const canvas2: HTMLElement | null = document.getElementById('webgl2');
    if (canvas1 && canvas2) {
      homeThree(canvas1);
      earthThree(canvas2);
    }
    return () => {
      const canvas1 = document.getElementById('webgl1');
      if (canvas1) {
        canvas1.innerHTML = '';
      }
      const canvas2 = document.getElementById('webgl2');
      if (canvas2) {
        canvas2.innerHTML = '';
      }
    };
  }, []);
  return (
    <div className="left-0 top-0">
      <canvas
        id="webgl1"
        className="z-0 h-1/3 w-1/3 bg-cover bg-center bg-no-repeat"
      ></canvas>
      <canvas
        id="webgl2"
        className="h-1/3 w-1/3 bg-cover bg-center bg-no-repeat"
      ></canvas>
    </div>
  );
};

export default HomeThree;
