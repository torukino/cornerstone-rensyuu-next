import createImageIdsAndCacheMetaData from '@/tools/cornerstoneTools/createImageIdsAndCacheMetaData';

/**
 * イメージIDを作成し、メタデータをキャッシュします。
 *
 * @param {boolean} gcp - GCPの使用が有効かどうか。
 * @param {string} SeriesInstanceUID - シリーズインスタンスの一意識別子。
 * @param {string} StudyInstanceUID - スタディインスタンスの一意識別子。
 * @returns {Promise<string[]>} イメージIDの配列のプロミス。
 * @example
 * const ids = await getImageIds(true, 'シリーズUID', 'スタディUID');
 */
export const getImageIds = async (
  gcp: boolean,
  SeriesInstanceUID: string,
  StudyInstanceUID: string,
): Promise<string[]> => {
  const imageIds = await createImageIdsAndCacheMetaData({
    gcp,
    SeriesInstanceUID: SeriesInstanceUID,
    StudyInstanceUID: StudyInstanceUID,
    wadoRsRoot:
      'https://healthcare.googleapis.com/v1/projects/dicom-rensyuu/locations/asia-northeast1/datasets/ohif-dataset/dicomStores/ohif-datastore/dicomWeb',
  });

  return imageIds;
};
