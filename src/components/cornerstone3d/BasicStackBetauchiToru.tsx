'use client';
import * as cornerstoneTools from '@cornerstonejs/tools';
import React, { useEffect } from 'react';

import { runMain } from '@/components/cornerstone3d/rensyuuTools/runMain';

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
  const idName = 'stackBasicBetauchi';
  const { MouseBindings } = csToolsEnums;

  useEffect(() => {
    if (SeriesInstanceUID && StudyInstanceUID && DerivativeDiscription) {
      runMain(
        idName,
        SeriesInstanceUID,
        StudyInstanceUID,
        DerivativeDiscription,
      );
    }
    return () => {
      const content = document.getElementById(`${idName}-content`);
      if (content) content.innerHTML = '';
      const toolbar = document.getElementById(`${idName}-toolbar`);
      if (toolbar) toolbar.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SeriesInstanceUID, StudyInstanceUID, DerivativeDiscription]);
  return (
    <div className="mb-10 ml-10">
      <h1 className="text-3xl"></h1>
      <p className="text-xl text-blue-800"></p>
      <div
        id={`${idName}-toolbar`}
        className="justify-between text-blue-500"
      ></div>
      <div
        id={`${idName}-content`}
        className="h-[800px] w-[400px] items-center"
      ></div>
    </div>
  );
};

export default StackBasicBetauchiToru;
