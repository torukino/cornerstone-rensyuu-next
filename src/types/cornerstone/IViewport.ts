import ViewportStatus from '@/enums/cornerstone/ViewportStatus';
import ViewportType from '@/enums/cornerstone/ViewportType';
import DisplayArea from '@/types/cornerstone/displayArea';
import { ActorEntry } from '@/types/cornerstone/IActor';
import ICamera from '@/types/cornerstone/ICamera';
import Point2 from '@/types/cornerstone/Point2';
import Point3 from '@/types/cornerstone/Point3';
import ViewportInputOptions from '@/types/cornerstone/ViewportInputOptions';

/**
 * Viewport interface for cornerstone viewports
 */
interface IViewport {
  /** unique identifier of the viewport */
  id: string;
  /** renderingEngineId the viewport belongs to */
  _actors: Map<string, any>;
  /** viewport type, can be ORTHOGRAPHIC or STACK for now */
  canvas: HTMLCanvasElement;
  /** canvas associated to the viewport */
  canvasToWorld: (canvasPos: Point2) => Point3;
  /** public DOM element associated to the viewport */
  customRenderViewportToCanvas: () => unknown;
  /** sx of the viewport on the offscreen canvas (if rendering using GPU) */
  defaultOptions: any;
  /** sy of the viewport on the offscreen canvas (if rendering using GPU) */
  element: HTMLDivElement;
  /** width of the viewport on the offscreen canvas (if rendering using GPU) */
  getFrameOfReferenceUID: () => string;
  /** height of the viewport on the offscreen canvas (if rendering using GPU) */
  getRotation: () => number;
  /** actors rendered in the viewport*/
  isDisabled: boolean;
  /** viewport default options including the axis, and background color  */
  options: ViewportInputOptions;
  /** viewport options */
  renderingEngineId: string;
  /** Suppress events */
  sHeight: number;
  /** if the viewport has been disabled */
  suppressEvents: boolean;
  /** The rendering state of this viewport */
  sWidth: number;
  /** the rotation applied to the view */
  sx: number;
  /** frameOfReferenceUID the viewport's default actor is rendering */
  sy: number;
  /** method to convert canvas to world coordinates */
  type: ViewportType;
  /** method to convert world to canvas coordinates */
  updateRenderingPipeline: () => void;
  /** get the first actor */
  getDefaultActor(): ActorEntry;
  /** returns all the actor entires for a viewport which is an object containing actor and its uid */
  getActors(): Array<ActorEntry>;
  /** returns specific actor by its uid */
  getActor(actorUID: string): ActorEntry;
  /** returns specific actor uid by array index */
  getActorUIDByIndex(index: number): string;
  /** returns specific actor by array index */
  getActorByIndex(index: number): ActorEntry;
  /** set and overwrite actors in a viewport */
  setActors(actors: Array<ActorEntry>): void;
  /** add actors to the list of actors */
  addActors(actors: Array<ActorEntry>): void;
  /** add one actor */
  addActor(actorEntry: ActorEntry): void;
  /** remove all actors from the viewport */
  removeAllActors(): void;
  /** remove array of uids */
  removeActors(actorUIDs: Array<string>): void;
  /** returns the renderingEngine instance the viewport belongs to */
  getRenderingEngine(): any;
  /** returns the vtkRenderer (for GPU rendering) of the viewport */
  getRenderer(): void;
  /** triggers render for all actors in the viewport */
  render(): void;
  /** set options for the viewport */
  setOptions(options: ViewportInputOptions, immediate: boolean): void;
  /** set displayArea for the viewport */
  setDisplayArea(
    displayArea: DisplayArea,
    callResetCamera?: boolean,
    suppressEvents?: boolean,
  ): void;
  /** returns the displayArea */
  getDisplayArea(): DisplayArea | undefined;
  /** reset camera and options*/
  reset(immediate: boolean): void;
  /** returns the canvas */
  getCanvas(): HTMLCanvasElement;
  /** returns camera object */
  getCamera(): ICamera;
  /** Sets the rendered state to rendered if the render actually showed image data */
  setRendered(): void;
  /** returns the parallel zoom relative to the default (eg returns 1 after reset) */
  getZoom(): number;
  /** Sets the relative zoom - set to 1 to reset it */
  setZoom(zoom: number, storeAsInitialCamera?: boolean):void;
  /** Gets the canvas pan value */
  getPan(): Point2;
  /** Sets the canvas pan value */
  setPan(pan: Point2, storeAsInitialCamera?: boolean):void;
  /** sets the camera */
  setCamera(cameraInterface: ICamera, storeAsInitialCamera?: boolean): void;
  /** whether the viewport has custom rendering */
  viewportStatus: ViewportStatus;
  _getCorners(bounds: Array<number>): Array<number>[];
  worldToCanvas: (worldPos: Point3) => Point2;
}

/**
 * Public Interface for viewport input to get enabled/disabled or set
 */
type PublicViewportInput = {
  /** HTML element in the DOM */
  defaultOptions?: ViewportInputOptions;
  /** unique id for the viewport in the renderingEngine */
  element: HTMLDivElement;
  /** type of the viewport */
  type: ViewportType;
  /** options for the viewport */
  viewportId: string;
};

type NormalizedViewportInput = {
  /** HTML element in the DOM */
  defaultOptions: ViewportInputOptions;
  /** unique id for the viewport in the renderingEngine */
  element: HTMLDivElement;
  /** type of the viewport */
  type: ViewportType;
  /** options for the viewport */
  viewportId: string;
};

type InternalViewportInput = {
  canvas: HTMLCanvasElement;
  defaultOptions: ViewportInputOptions;
  element: HTMLDivElement;
  type: ViewportType;
  viewportId: string;
};

type ViewportInput = {
  id: string;
  canvas: HTMLCanvasElement;
  defaultOptions: ViewportInputOptions;
  element: HTMLDivElement;
  renderingEngineId: string;
  sHeight: number;
  sWidth: number;
  sx: number;
  sy: number;
  type: ViewportType;
};

export type {
  InternalViewportInput,
  IViewport,
  NormalizedViewportInput,
  PublicViewportInput,
  ViewportInput,
};
