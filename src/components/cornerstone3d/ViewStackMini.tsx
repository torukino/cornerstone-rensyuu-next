'use client';
import { RenderingEngine } from '@cornerstonejs/core';
import React, { useEffect, useState } from 'react';

import { getElementMini } from '@/components/cornerstone3d/rensyuuTools/getElementMini';
import { runViewStackMini } from '@/components/cornerstone3d/rensyuuTools/runViewStackMini';
import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import { initDemo } from '@/tools/cornerstoneTools';

const BUG = true;
interface PROPS {
  DerivativeDiscription: string | undefined;
  index: number;
  renderingEngine: RenderingEngine;
  SeriesInstanceUID: string | undefined;
  StudyInstanceUID: string | undefined;
}

const ViewStackMini: React.FC<PROPS> = ({
  DerivativeDiscription,
  index,
  renderingEngine,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const [comment, setComment] = useState<string>(DerivativeDiscription || '');
  const [idName, setIdName] = useState<string>(index + '-viewStackMini');
  const [loading, setLoading] = useState<boolean>(true); // 新たに追加
  console.log('@@-@@-@@ ', idName);
  const viewStackAsync = async (
    idName: string,
    element: HTMLDivElement,
    SeriesInstanceUID: string | undefined,
    StudyInstanceUID: string | undefined,
    DerivativeDiscription: string | undefined,
    renderingEngine: RenderingEngine,
  ) => {
    if (!SeriesInstanceUID || !StudyInstanceUID) return undefined;
    const gcp = true;
    await initDemo(gcp);

    // Dicom の使い方に従った画像の取得
    const imageIds = await getImageIds(
      gcp,
      SeriesInstanceUID,
      StudyInstanceUID,
    );
    const viewportId = idName + '-ViewportId';

    // BUG && console.log('@@-@@ ', DerivativeDiscription || '');
    await runViewStackMini(imageIds, element, viewportId, renderingEngine);
    setLoading(false); // 画像データが利用可能になったらloadingをfalseに設定
    setComment(DerivativeDiscription || ' ');
  };

  useEffect(() => {
    const content = document.getElementById(idName + '-content');
    if (!content) return undefined;
    content.innerHTML = '';
    const element: HTMLDivElement = getElementMini(idName);
    if (!element) return undefined;
    content.appendChild(element);

    viewStackAsync(
      idName,
      element,
      SeriesInstanceUID,
      StudyInstanceUID,
      DerivativeDiscription,
      renderingEngine,
    );

    if (loading) return;
    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID, idName]);

  return (
    <div>
      <div id={`${idName}-toolbar`}></div>
      <div className="bg-white">{comment}</div>
      <div id={`${idName}-content`}></div>
    </div>
  );
};

export default ViewStackMini;
