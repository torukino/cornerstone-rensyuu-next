import { parse } from 'date-fns';

import { CLIENTFLAT } from '@/types/clients/clientFlat';

const calculateAge = (birthdate: Date, referenceDate: Date): string => {
  let age = referenceDate.getFullYear() - birthdate.getFullYear();
  let m = referenceDate.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birthdate.getDate())) {
    age--;
  }
  return age.toString().padStart(3, '0') + 'Y';
}

export const convertDicomTagsToJson = (inputData: any): CLIENTFLAT => {
  const birthdate = parse(inputData['00100030']['Value'][0], "yyyyMMdd", new Date());
  const referenceDate = parse(inputData['00080020']['Value'][0], "yyyyMMdd", new Date());

  const outputData: CLIENTFLAT = {
    id: inputData['00100020']['Value'][0],
    name: inputData['00100010']['Value'][0]['Ideographic'],
    age: calculateAge(birthdate, referenceDate),
    birthday: inputData['00100030']['Value'][0],
    date: inputData['00080020']['Value'][0],
    DerivativeDiscription: inputData['0008103E'] && inputData['0008103E'].Value ? inputData['0008103E']['Value'][0] : null, 
    gender: inputData['00100040']['Value'][0],
    No: inputData['00200013'].Value ? inputData['00200013']['Value'][0] : null, 
    SeriesInstanceUID: inputData['0020000E']['Value'][0],
    SeriesNumber: inputData['00200010']['Value'][0],
    SOPInstanceUID: inputData['00080018']['Value'][0],
    StudyInstanceUID: inputData['0020000D']['Value'][0], 
    time: inputData['00080030']['Value'][0],
    type: inputData['00080060']['Value'][0],
    yomi: inputData['00100010']['Value'][0]['Phonetic'],
  };
  return outputData;
}
