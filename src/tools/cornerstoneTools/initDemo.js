import { init as csRenderInit } from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';

import initCornerstoneDICOMImageLoader from './initCornerstoneDICOMImageLoader';
import initProviders from './initProviders';
import initVolumeLoader from './initVolumeLoader';

export default async function initDemo(gcp) {
  initProviders();
  initCornerstoneDICOMImageLoader(gcp);
  initVolumeLoader();
  await csRenderInit();
  await csToolsInit();
}
