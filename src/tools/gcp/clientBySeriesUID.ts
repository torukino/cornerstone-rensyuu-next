import { getUrl } from '@/tools/gcp/getUrl';
import { CLIENTFLAT } from '@/types/clients/clientFlat';
import { CLIENTSERIES } from '@/types/clients/clientWithSeries';

export const clientBySeriesUID = (
  clientWithSelectedId: CLIENTFLAT[],
): CLIENTSERIES[] => {
  const seriesUIDArray = clientWithSelectedId.map(
    (c) => c['SeriesInstanceUID'],
  );
  const seriesUIDSet = new Set(seriesUIDArray);
  const seriesUIDArrayUnique = Array.from(seriesUIDSet);
  // SeriesInstanceUIDごとにまとめる
  const clientWithSeriesArray: CLIENTSERIES[] = [];

  for (const seriesUID of seriesUIDArrayUnique) {
    const clients: CLIENTFLAT[] = clientWithSelectedId.filter(
      (c) => c['SeriesInstanceUID'] === seriesUID,
    );

    const seriesArray = clients.map((cc: CLIENTFLAT) => {
      const url: string = getUrl(cc);
      return {
        imagePositionPatient: cc.imagePositionPatient,
        InstanceUID: cc.InstanceUID,
        SeriesInstanceUID: cc.SeriesInstanceUID,
        SeriesNumber: cc.SeriesNumber,
        sliceLocation: cc.sliceLocation,
        SOPInstanceUID: cc.SOPInstanceUID,
        StudyInstanceUID: cc.StudyInstanceUID,
        url: url,
      };
    });

    const c = clients[0];
    const clientElement: CLIENTSERIES = {
      id: c.id,
      name: c.name,
      age: c.age,
      birthday: c.birthday,
      date: c.date,
      DerivativeDiscription: c.DerivativeDiscription,
      gender: c.gender,
      No: c.No,
      seriesArray: seriesArray,
      time: c.time,
      type: c.type,
      yomi: c.yomi,
    };
    clientWithSeriesArray.push(clientElement);
  }

  return clientWithSeriesArray;
};
