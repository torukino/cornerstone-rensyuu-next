import { CLIENTFLAT } from '../../types/clients/clientFlat';
import {
  CLIENTUNIQUEID,
  initClientUniqueId,
} from '../../types/clients/clientUniqueId';

export function convertAllClientFlatToClientUniqueById(
  all_Info: CLIENTFLAT[],
): CLIENTUNIQUEID[] {
  const ids = all_Info.map((info) => info.id);
  const uniqueIdsSet = new Set(ids);
  const uniqueIds = Array.from(uniqueIdsSet);
  const uniqueIdInfo: CLIENTUNIQUEID[] = [];
  for (let id of uniqueIds) {
    const w: CLIENTFLAT =
      all_Info.find((info) => info.id === id) || initClientUniqueId;
    const ww: CLIENTUNIQUEID = {
      id: w.id,
      name: w.name,
      age: w.age,
      birthday: w.birthday,
      gender: w.gender,
      yomi: w.yomi,
    };
    uniqueIdInfo.push(ww);
  }
  return uniqueIdInfo;
}
