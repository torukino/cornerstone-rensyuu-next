import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import { useRef } from 'react';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
});

const DicomImageTest = () => {
  const viewportElement = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      cornerstone.loadImage(imageId).then((image) => {
        const element = viewportElement.current;
        if (element) {
          const viewport = cornerstone.getDefaultViewportForImage(
            element,
            image,
          );
          cornerstone.displayImage(element, image, viewport);
        }
      });
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div ref={viewportElement} style={{ height: '512px', width: '512px' }} />
    </div>
  );
};

export default DicomImageTest;
