import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  Types,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';

import { getImageIds } from '@/components/cornerstone3d/tools/getImageIds';
import {
  addButtonToToolbar,
  initDemo,
  setTitleAndDescription,
} from '@/tools/cornerstoneTools';

const {
  Enums: csToolsEnums,
  ToolGroupManager,
  WindowLevelTool,
} = cornerstoneTools;

export const initStackVOISigmoid = async (idName: string): Promise<void> => {
  const { MouseBindings } = csToolsEnums;
  const toolGroupId = 'STACK_TOOL_GROUP_ID';

  // This is for debugging purposes
  console.warn(
    'Click on index.ts to open source code for this example --------->',
  );

  const { ViewportType } = Enums;
  const renderingEngineId = idName + '-RenderingEngine';
  const viewportId = 'STACK_VP';

  // ======== Set up page ======== //
  setTitleAndDescription(
    idName,
    'Sigmoid VOI Stack',
    'This example shows how to set a Sigmoid VOI on a Stack viewport.',
  );

  const content = document.getElementById(idName + '-content');
  const element = document.createElement('div');
  element.id = 'cornerstone-element';
  element.style.width = '500px';
  element.style.height = '500px';

  content?.appendChild(element);
  // ============================= //

  addButtonToToolbar({
    title: 'Set Linear VOI',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Set a range to highlight bones
      viewport.setProperties({
        VOILUTFunction: Enums.VOILUTFunctionType.LINEAR,
      });

      viewport.render();
    },
  });

  addButtonToToolbar({
    title: 'Set Sigmoid VOI',
    idName,
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);

      // Get the stack viewport
      const viewport = <Types.IStackViewport>(
        renderingEngine?.getViewport(viewportId)
      );

      // Set a range to highlight bones
      viewport.setProperties({
        VOILUTFunction: Enums.VOILUTFunctionType.SAMPLED_SIGMOID,
      });

      viewport.render();
    },
  });

  /**
   * Runs the demo
   */
  async function run() {
    // Init Cornerstone and related libraries
    const gcp = true;
    await initDemo(gcp);

    // Add tools to Cornerstone3D
    try {
      cornerstoneTools.addTool(WindowLevelTool);
    } catch (e) {
      console.log('error', e);
    }
    // Define a tool group, which defines how mouse events map to tool commands for
    // Any viewport using the group
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // Add the tools to the tool group
    toolGroup?.addTool(WindowLevelTool.toolName);

    // Set the initial state of the tools, here we set one tool active on left click.
    // This means left click will draw that tool.
    toolGroup?.setToolActive(WindowLevelTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });

    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await getImageIds(gcp);

    // createImageIdsAndCacheMetaData({
    //   SeriesInstanceUID:
    //     '1.3.6.1.4.1.9590.100.1.2.374115997511889073021386151921807063992',
    //   StudyInstanceUID:
    //     '1.3.6.1.4.1.9590.100.1.2.85935434310203356712688695661986996009',
    //   wadoRsRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
    // });

    // Instantiate a rendering engine
    const renderingEngine = new RenderingEngine(renderingEngineId);

    toolGroup?.addViewport(viewportId, renderingEngineId);

    // Create a stack viewport
    const viewportInput = {
      defaultOptions: {
        background: <Types.Point3>[0.2, 0, 0.2],
      },
      element,
      type: ViewportType.STACK,
      viewportId,
    };

    renderingEngine.enableElement(viewportInput);

    // Get the stack viewport that was created
    const viewport = <Types.IStackViewport>(
      renderingEngine.getViewport(viewportId)
    );

    // Define a stack containing a single image
    const stack = [imageIds[0]];

    // Set the stack on the viewport
    await viewport.setStack(stack);

    // Render the image
    viewport.render();
  }

  run();
};
