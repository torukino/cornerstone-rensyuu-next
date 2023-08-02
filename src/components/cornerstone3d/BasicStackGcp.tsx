'use client';

import { Enums, RenderingEngine, Types } from '@cornerstonejs/core';
import React, { useEffect, useRef } from 'react';

import {
  createImageIdsAndCacheMetaData,
  ctVoiRange,
  initDemo,
} from '@/utils/demo/helpers';

const { ViewportType } = Enums;

const StackBasicGcp = () => {
  const basciStackRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      const gcp: boolean = true;
      await initDemo(gcp);

      const imageIds = await createImageIdsAndCacheMetaData({
        SeriesInstanceUID:
          '1.2.840.113619.2.388.10502719.2140785.15434.1666568329.907',
        StudyInstanceUID:
          '1.2.840.113619.6.388.264539096114033263069777858756428804823',
        wadoRsRoot:
          'https://healthcare.googleapis.com/v1/projects/dicom-rensyuu/locations/asia-northeast1/datasets/ohif-dataset/dicomStores/ohif-datastore/dicomWeb',
      });

      // Instantiate a rendering engine
      const renderingEngineId = 'myRenderingEngine';
      const renderingEngine = new RenderingEngine(renderingEngineId);

      if (basciStackRef.current) {
        // Create a stack viewport
        const viewportId = 'CT_STACK';
        const viewportInput = {
          defaultOptions: {
            background: [0.2, 0, 0.2] as Types.Point3,
          },
          element: basciStackRef.current,
          type: ViewportType.STACK,
          viewportId,
        };

        renderingEngine.enableElement(viewportInput);

        // Get the stack viewport that was created
        const viewport = renderingEngine.getViewport(
          viewportId,
        ) as Types.IStackViewport;

        // Define a stack containing a single image
        const stack = [imageIds[0]];

        // Set the stack on the viewport
        await viewport.setStack(stack);

        // Set the VOI of the stack
        viewport.setProperties({ voiRange: ctVoiRange });

        // Render the image
        viewport.render();
      }
    };

    run();
  }, []);

  return (
    <div ref={basciStackRef} style={{ height: '500px', width: '500px' }} />
  );
};

export default StackBasicGcp;
