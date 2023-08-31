const lower = 0;
const upper = 2500;

const mriVoiRange = { lower, upper };

export default function setMriTransferFunctionForVolumeActor({ volumeActor }) {
  volumeActor
    .getProperty()
    .getRGBTransferFunction(0)
    .setMappingRange(lower, upper);
}

export { mriVoiRange };
