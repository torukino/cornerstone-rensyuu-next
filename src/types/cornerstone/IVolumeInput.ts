import BlendModes from '@/enums/cornerstone/BlendModes';
import { VolumeActor } from '@/type/cornerstone/IActor';

/**
 * Volume input callback type, used to perform operations on the volume data
 * after it has been loaded.
 */
type VolumeInputCallback = (params: {
  /** vtk volume actor */
  volumeActor: VolumeActor;
  /** unique volume Id in the cache */
  volumeId: string;
}) => unknown;

/**
 * VolumeInput that can be used to add a volume to a viewport. It includes
 * mandatory `volumeId` but other options such as `visibility`, `blendMode`,
 * `slabThickness` and `callback` can also be provided
 */
interface IVolumeInput {
  /** Volume ID of the volume in the cache */
  actorUID?: string;
  // actorUID for segmentations, since two segmentations with the same volumeId
  // can have different representations
  blendMode?: BlendModes;
  /** Visibility of the volume - by default it is true */
  callback?: VolumeInputCallback;
  /** Callback to be called when the volume is added to the viewport */
  slabThickness?: number;
  /** Blend mode of the volume - by default it is `additive` */
  visibility?: boolean;
  /** Slab thickness of the volume - by default it is 0.05*/
  volumeId: string;
}

export type { IVolumeInput, VolumeInputCallback };
