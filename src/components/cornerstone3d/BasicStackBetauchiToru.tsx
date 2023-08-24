'use client';
import * as cornerstoneTools from '@cornerstonejs/tools';
import React, { useEffect } from 'react';

import { runMain } from '@/components/cornerstone3d/rensyuuTools/runMain';
import { runMainVolume3DHair } from '@/components/cornerstone3d/rensyuuTools/runMainVolume3DHair';

const {
  AngleTool,
  ArrowAnnotateTool,
  BidirectionalTool,
  CircleROITool,
  CobbAngleTool,
  EllipticalROITool,
  Enums: csToolsEnums,
  LengthTool,
  PanTool,
  PlanarFreehandROITool,
  ProbeTool,
  RectangleROITool,
  StackScrollMouseWheelTool,
  StackScrollTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} = cornerstoneTools;

const BUG = false;
interface PROPS {
  DerivativeDiscription: string;
  SeriesInstanceUID: string;
  StudyInstanceUID: string;
}

const StackBasicBetauchiToru: React.FC<PROPS> = ({
  DerivativeDiscription,
  SeriesInstanceUID,
  StudyInstanceUID,
}) => {
  const idName = 'stackBasicBetauchiToru';
  const idName2D = 'stackBasicBetauchiToru' + '2D';
  const idName3D = 'stackBasicBetauchiToru' + '3D';

  const [twoDToThreeD, setTwoDToThreeD] = React.useState<boolean>(true);

  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID) {
      runMain(
        idName2D,
        SeriesInstanceUID,
        StudyInstanceUID,
        DerivativeDiscription,
      );
      runMainVolume3DHair(
        idName3D,
        SeriesInstanceUID,
        StudyInstanceUID,
        DerivativeDiscription,
      );
    }
    return () => {
      const content2D = document.getElementById(`${idName2D}-content`);
      if (content2D) content2D.innerHTML = '';
      const toolbar2D = document.getElementById(`${idName2D}-toolbar`);
      if (toolbar2D) toolbar2D.innerHTML = '';
      const content3D = document.getElementById(`${idName3D}-content`);
      if (content3D) content3D.innerHTML = '';
      const toolbar3D = document.getElementById(`${idName3D}-toolbar`);
      if (toolbar3D) toolbar3D.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID]);
  console.log('StackBasicBetauchiToru', twoDToThreeD.toString());
  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>
      <div onClick={() => setTwoDToThreeD(!twoDToThreeD)}>{'2D<=>3D'}</div>

      <div>
        <div
          id={`${idName2D}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div id={`${idName2D}-content`} className=" items-center"></div>
      </div>

      <div>
        <div
          id={`${idName3D}-toolbar`}
          className="justify-between text-blue-500"
        ></div>
        <div id={`${idName3D}-content`} className="items-center"></div>
      </div>
    </div>
  );
};

export default StackBasicBetauchiToru;
