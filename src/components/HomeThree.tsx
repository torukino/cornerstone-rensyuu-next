'use client';
import React, { useEffect } from 'react';

import { sea } from '@/tools/shaders/sea';
import { earthThree } from '@/tools/three/earthThree';
import { homeThree } from '@/tools/three/homeThree';

const HomeThree = () => {
  useEffect(() => {
    const canvas1: HTMLElement | null = document.getElementById('webgl1');
    const canvas2: HTMLElement | null = document.getElementById('webgl2');
    const canvas3: HTMLElement | null = document.getElementById('webgl3');
    if (canvas1 && canvas2) {
      homeThree(canvas1);
      earthThree(canvas2);
      sea(canvas3);
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
      const canvas3 = document.getElementById('webgl3');
      if (canvas3) {
        canvas3.innerHTML = '';
      }
    };
  }, []);
  return (
    <div className="left-0 top-0 flex h-screen flex-col items-center justify-center">
      <div>
        <canvas
          id="webgl1"
          className="bg-cover bg-center bg-no-repeat"
        ></canvas>
      </div>
      <div>
        <canvas
          id="webgl2"
          className="bg-cover bg-center bg-no-repeat"
        ></canvas>
      </div>
      <div>
        <main className="absolute flex flex-col items-center justify-end text-white">
          <h1 className="pl-24 pt-44 text-2xl">Dive Into Deep ...</h1>
          <p className="pl-32 pt-8 text-base">認知症、人、もっと深みへ</p>
        </main>
        <canvas id="webgl3" className="bg-center bg-no-repeat"></canvas>
      </div>
    </div>
  );
};

export default HomeThree;
