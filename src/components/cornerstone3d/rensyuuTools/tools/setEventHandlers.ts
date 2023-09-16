import { displayImagePageIndex } from './displayImagePageIndex';

export const setEventHandlers = (
  renderingEngineId: string,
  viewportId: string,
  imageIds: string[],
  element: HTMLDivElement,
) => {
  displayImagePageIndex(renderingEngineId, viewportId, imageIds, element);

  let timeoutId: NodeJS.Timeout | null = null;

  // マウスホイールイベントリスナーを追加
  element.addEventListener('wheel', () => {
    // 既存のタイムアウトがある場合はクリア
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 新しいタイムアウトを設定
    timeoutId = setTimeout(() => {
      // 画像のインデックスを更新
      displayImagePageIndex(renderingEngineId, viewportId, imageIds, element);
      timeoutId = null;
    }, 100); // 100ミリ秒の遅延を設ける
  });
};
