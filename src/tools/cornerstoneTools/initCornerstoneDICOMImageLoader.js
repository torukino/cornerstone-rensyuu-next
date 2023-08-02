import * as cornerstone from '@cornerstonejs/core';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import * as cornerstoneTools from '@cornerstonejs/tools';
import dicomParser from 'dicom-parser';

window.cornerstone = cornerstone;
window.cornerstoneTools = cornerstoneTools;
const { preferSizeOverAccuracy, useNorm16Texture } =
  cornerstone.getConfiguration().rendering;

export default async function initCornerstoneDICOMImageLoader(gcp) {
  cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
  cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;

  const tokenResponse = await fetch('http://localhost:3000/api/authToken');
  const tokenData = await tokenResponse.json();
  const token = 'Bearer ' + tokenData.token;
  // const headers = {
  //   Authorization: `${token}`,
  // };

  if (gcp) {
    cornerstoneDICOMImageLoader.configure({
      beforeSend: function (xhr) {
        //   // Add custom headers here.
        xhr.setRequestHeader('Authorization', `${token}`);
        // Object.keys(headers).forEach(function (header) {
        //   xhr.setRequestHeader(header, headers[header]);
        // });
      },

      decodeConfig: {
        convertFloatPixelDataToInt: false,
        use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
      },
      // headers: {
      //   Authorization: "Bearer " + token
      // },
      useWebWorkers: true,
    });
  } else {
    cornerstoneDICOMImageLoader.configure({
      decodeConfig: {
        convertFloatPixelDataToInt: false,
        use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
      },
      useWebWorkers: true,
    });
  }

  let maxWebWorkers = 1;

  if (navigator.hardwareConcurrency) {
    maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
  }

  var config = {
    maxWebWorkers,
    startWebWorkersOnDemand: false,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        strict: false,
      },
    },
  };

  cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
}
