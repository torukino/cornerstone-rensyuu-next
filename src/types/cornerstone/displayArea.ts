type DisplayArea = {
  imageArea: [number, number]; // areaX, areaY
  imageCanvasPoint: {
    canvasPoint: [number, number]; // imageX, imageY
    imagePoint: [number, number]; // canvasX, canvasY
  };
  storeAsInitialCamera: boolean;
};

export default DisplayArea;
