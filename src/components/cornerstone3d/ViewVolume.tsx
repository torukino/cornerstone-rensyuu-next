'use client';
import { RenderingEngine } from '@cornerstonejs/core';
import React, { useEffect, useState } from 'react';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { runViewVolume } from '@/components/cornerstone3d/rensyuuTools/runViewVolume';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo } from '@/tools/cornerstoneTools';

const BUG = true;
interface PROPS {
  DerivativeDiscription: string;
  renderingEngine: RenderingEngine;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const ViewVolume: React.FC<PROPS> = ({
  DerivativeDiscription,
  renderingEngine,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const [comment, setComment] = useState<string>(DerivativeDiscription);
  const [idName, setIdName] = useState<string>('viewVolume');
  const viewVolumeAsync = async (
    idName: string,
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
    renderingEngine: RenderingEngine,
  ) => {
    const gcp = true;
    await initDemo(gcp);
    const content = document.getElementById(idName + '-content');
    if (!content) return undefined;
    // content.innerHTML = '';
    const element: HTMLDivElement = getElement(idName);

    content.appendChild(element);

    // Dicom の使い方に従った画像の取得
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );

    // const renderingEngineId = 'RenderingEngine';
    const viewportId = idName + '-viewportId';

    const volumeName = 'MRI-volume-id';
    const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
    const volumeId = `${volumeLoaderScheme}:${volumeName}`;
    const coordinates: HTMLElement | null = document.getElementById(
      `${idName}-coordinates`,
    );
    if (!coordinates) return;

    //volumeかstackかを判定する
    BUG && console.log('@@-@@ ', DerivativeDiscription);
    let isVolume = false;
    if (DerivativeDiscription) isVolume = true;

    runViewVolume(
      idName,
      imageIds,
      coordinates,
      element,
      renderingEngine,
      volumeId,
      viewportId,
      isVolume,
    );
  };

  useEffect(() => {
    setComment(DerivativeDiscription);
    viewVolumeAsync(
      idName,
      SeriesInstanceUID,
      StudyInstanceUID,
      DerivativeDiscription,
      renderingEngine,
    );

    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
      const coordinates = document.getElementById(`${idName}-coordinates`);
      if (coordinates) coordinates.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID, renderingEngine]);
  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>

      <div>
        <div
          id={`${idName}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div className="w-1/6 bg-white">{comment}</div>
        <div id={`${idName}-content`} className=" items-center"></div>
        <div id={`${idName}-coordinates`}></div>
      </div>
    </div>
  );
};

export default ViewVolume;
