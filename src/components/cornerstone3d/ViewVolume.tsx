'use client';
import React, { useEffect } from 'react';

import { getElement } from '@/components/cornerstone3d/rensyuuTools/getElement';
import { runViewVolume } from '@/components/cornerstone3d/rensyuuTools/runViewVolume';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo } from '@/tools/cornerstoneTools';

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const ViewVolume: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'viewVolume';
  const viewVolumeAsync = async (
    idName: string,
    SeriesInstanceUID: string,
    StudyInstanceUID: string,
    DerivativeDiscription: string,
  ) => {
    const gcp = true;
    await initDemo(gcp);
    const content = document.getElementById(idName + '-content');
    if (!content) return undefined;

    const element: HTMLDivElement = getElement(idName);
    content.appendChild(element);

    // Dicom の使い方に従った画像の取得
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );

    const renderingEngineId = idName + '-RenderingEngine';
    const viewportId = idName + '-MRI-volume';

    const volumeName = 'MRI-volume-id';
    const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
    const volumeId = `${volumeLoaderScheme}:${volumeName}`;
    const content_crd:HTMLElement|null = document.getElementById(`${idName}-content`);
    if (!content_crd) return undefined;

    runViewVolume(
      imageIds,
      content_crd,
      element,
      renderingEngineId,
      volumeId,
      viewportId,
    );
  };

  useEffect(() => {
    viewVolumeAsync(
      idName,
      SeriesInstanceUID,
      StudyInstanceUID,
      DerivativeDiscription,
    );

    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID]);
  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>

      <div>
        <div
          id={`${idName}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div id={`${idName}-content`} className=" items-center"></div>
      </div>
    </div>
  );
};

export default ViewVolume;
