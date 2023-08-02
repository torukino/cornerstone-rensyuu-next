'use client';

import React, { useRef } from 'react';

// import { initCornerstone } from '@/tools/cornerstoneTool/initCornerstone';
// import { loadAndViewImage } from '@/tools/cornerstoneTool/loadAndViewImage';
import { CLIENTFLAT } from '@/types/clients/clientFlat';

function DicomImage({ selectedClient }: { selectedClient: CLIENTFLAT }) {
  const viewportElement = useRef(null); // ビューポートの参照を作成

  // useEffect(() => {
  //   const cornerstoneSettings = async () => {
  //     await initCornerstone();
  //     if (viewportElement.current) {
  //       await loadAndViewImage(selectedClient, viewportElement);
  //     }
  //   };
  //   cornerstoneSettings();
  // }, [selectedClient]);

  // ビューポートの参照をcanvas要素に割り当て
  return (
    <div className="bg-blue-200">
      <canvas ref={viewportElement} />
    </div>
  );
}

export default DicomImage;
