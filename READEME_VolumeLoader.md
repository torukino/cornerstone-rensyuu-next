[https://www.cornerstonejs.org/docs/concepts/cornerstone-core/imageloader/]

# Image Loaders

ImageLoader は ImageId を受け取り Image Object を返す役割を担う JavaScript 関数です。
通常、画像の読み込みにはサーバーの呼び出しが必要なため、
画像読み込み用の API は非同期である必要があります。
Cornerstone では、イメージローダーが、
コーナーストーンがイメージ オブジェクトを非同期で受信するために使用する Promise を含むオブジェクトを返すか、
エラーが発生した場合はエラーを返す必要があります。

## Image Loader Workflow

- [ImageLoaders]は[registerImageLoader]API を使用してコーナーストーンを使用して
  自身を登録し、特定の ImageId URL スキームをロードします
- スタック用の loadImage API またはボリューム用の createAndCacheVolume API を使用して、アプリケーションはイメージのロードを要求します。
- Cornerstone は画像をロードするリクエストを、ImageLoader を利用して、imageId の URL スキームで登録されたリクエストに委任します。
- ImageLoader は一旦ピクセルデータを取得するとそれに対応する Image オブジェクトを resolve する Promise を含む Image Load Object を返します。
  ピクセル データを取得することはすなわち、XMLHttpRequest をつかってリモートサーバーにコールをリクエストし、
  ピクセル データの解凍 (例: JPEG 2000 から)したり、コーナーストーンが理解できる形式 (例: RGB 対 YBR カラー) へのピクセル データの変換をしたりします。
- resolve された Promise によって返された Image オブジェクトは、renderingEngine API を使用して表示されます。

## Image Loader を登録する

registerImageLoader は外部のイメージローダーで Cornerstone ライブラリを利用できるようにすることができます。
この関数は、イメージ ローダー関数 (2 番目の引数) が動作するような scheme を受け入れます。

## 利用可能な Image Loaders

| image Loader                   | 利用対象                                                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cornerstone WADO Image Loader  | DICOM パート 10 の画像。WADO-URI と WADO-RS をサポート。マルチフレーム DICOM インスタンスをサポート。File オブジェクトからの DICOM ファイルの読み取りをサポート |
| Cornerstone Web Image Loader   | PNG と JPEG                                                                                                                                                     |
| Cornerstone-nifti-image-loader | NIFTI                                                                                                                                                           |

# CornerstoneWADOImageLoader

CornerstoneWADOImageLoaderWADO は
WADO 準拠のサーバーから DICOM 画像をロードするコーナストーンの画像ローダーです。
そのことで次のコードのようにしてインストールし、初期化できます。
CornerstoneWADOImageLoade は wado-rs と wado-uri の imageLoader を Cornerstone3D に登録し
dicomParse を使って、メタデータとピクセル データをパースします。

```
import * as cornerstone from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
  decodeConfig: {
    convertFloatPixelDataToInt: false,
  },
});

var config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: false,
  taskConfiguration: {
    decodeTask: {
      initializeCodecsOnStartup: true,
      strict: false,
    },
  },
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
```

CornerstoneWADOImageLoader の初期化後、
CornerstoneWADOImageLoader の wado-uri image loader を経て、
wado-uri スキームを使って imageId がロードされます。
(例: imageId = 'wado-uri: https://exampleServer.com/wadoURIEndPoint?requestType=WADO&studyUID=1.2.3&seriesUID=4.5.6&objectUID=7.8.9&contentType=application%2Fdicom'),

wado-rs の場合では、
CornerstoneWADOImageLoader の wado-rs image loader を経て、ロードされます
（例： imageId = 'wado-rs: https://exampleServer.com/wadoRSEndPoint/studies/1.2.3/series/4.5.6/instances/7.8.9/frames/1')

## CornerstoneWebImageLoader

CornerstoneWebImageLoader は Web 画像 (PNG、JPEG)に対する別の画像ローダーです。
CornerstoneWADOImageLoader と同様に imageLoader をコーナーストーンに登録します。

```
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

cornerstoneWebImageLoader.configure({
  beforeSend: function (xhr) {
    // Add custom headers here (e.g. auth tokens)
    //xhr.setRequestHeader('x-auth-token', 'my auth token');
  },
});
```

# Volumes
ボリュームは、空間内の物理的なサイズと方向を持つ 3D データ配列です。
3D イメージング シリーズのピクセル データとメタデータを構成して構築することも、
アプリケーションによって最初から定義することもできます。
ボリュームには
FrameOfReferenceUID、
voxelSpacing (x,y,z)、
voxel dimensions (x,y,z)、
origin、および
orientationベクトルがあり、
患者の座標系に対してその座標系を一意に定義します。

## ImageVolume
では、基本クラスCornerstone3Dを使用してImageVolume3D 画像ボリュームを表します。
すべてのボリュームはこのクラスから派生します。
たとえば、StreamingImageVolumeこれはイメージごとにストリーミングされるボリュームを表すために使用されます。
StreamingImageVolumeクラスについては後ほど詳しく説明します

```
interface IImageVolume {
  /** unique identifier of the volume in the cache */
  readonly volumeId: string
  /** volume dimensions */
  dimensions: Point3
  /** volume direction */
  direction: Float32Array
  /** volume metadata */
  metadata: Metadata
  /** volume origin - set to the imagePositionPatient of the last image in the volume */
  origin: Point3
  /** volume scalar data */
  scalarData: any
  /** volume scaling metadata */
  scaling?: {
    PET?: {
      SUVlbmFactor?: number
      SUVbsaFactor?: number
      suvbwToSuvlbm?: number
      suvbwToSuvbsa?: number
    }
  }
  /** volume size in bytes */
  sizeInBytes?: number
  /** volume spacing */
  spacing: Point3
  /** number of voxels in the volume */
  numVoxels: number
  /** volume image data as vtkImageData */
  imageData?: vtkImageData
  /** openGL texture for the volume */
  vtkOpenGLTexture: any
  /** loading status object for the volume containing loaded/loading statuses */
  loadStatus?: Record<string, any>
  /** imageIds of the volume (if it is built of separate imageIds) */
  imageIds?: Array<string>
  /** volume referencedVolumeId (if it is derived from another volume) */
  referencedVolumeId?: string // if volume is derived from another volume
  /** method to convert the volume data in the volume cache, to separate images in the image cache */
  convertToCornerstoneImage?: (
    imageId: string,
    imageIdIndex: number
  ) => IImageLoadObject
}
```

# Volume Loaders

Image Loadersと同様に、ボリューム ローダーは
volumeIdと、volumeをロードするのに必要なその他の情報を受け取り、
volumeにresolveするPromiseを返します。
このvolumeには、2D画像のセット (例:imageIds ) や3D 配列オブジェクト (NIFTIフォーマットなど) から構築されます。


cornerstoneStreamingImageVolumeLoaderライブラリーを追加して、
2D画像(imageIds) の3D ボリュームへのストリーミングをサポートすることができました。

## Volume Loadersの登録

registerVolumeLoaderを使用して、特定のスキームを呼び出すようなボリューム ローダーを定義できます。

以下にcornerstoneStreamingImageVolumeLoaderについての簡略化したコードを示します。

1. 一連のimageId に基づいて、間隔、原点、方向などのボリューム メタデータを計算します。
2. 新しいStreamingImageVolumeのインスタンスを作成し、
   - StreamingImageVolumeはロードするためのメソッドを実装します ( .load)。
   - imageLoadPoolManagerを使用してロードを実装します。
   - ロードされた各フレーム (imageId) は3D ボリューム内の正しいスライスに配置されます。
3. VolumeにresolveしたPromiseを有するVolume Load Objectを返します。

```
function cornerstoneStreamingImageVolumeLoader(
  volumeId: string,
  options: {
    imageIds: Array<string>,
  }
) {
  // imageIdsに基づくボリューム メタデータを計算します。
  const volumeMetadata = makeVolumeMetadata(imageIds);
  const streamingImageVolume = new StreamingImageVolume(
    // ImageVolume properties
    {
      volumeId,
      metadata: volumeMetadata,
      dimensions,
      spacing,
      origin,
      direction,
      scalarData,
      sizeInBytes,
    },
    // Streaming properties
    {
      imageIds: sortedImageIds,
      loadStatus: {
        loaded: false,
        loading: false,
        cachedFrames: [],
        callbacks: [],
      },
    }
  );

  return {
    promise: Promise.resolve(streamingImageVolume),
    cancel: () => {
      streamingImageVolume.cancelLoading();
    },
  };
}

registerVolumeLoader(
  'cornerstoneStreamingImageVolume',
  cornerstoneStreamingImageVolumeLoader
);

// Used for any volume that its scheme is not provided
registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);
```

上で見たように、 
cornerstoneStreamingImageVolumeLoaderはcornerstoneStreamingImageVolumeスキームに登録されているため、
以下に示すように、
volumeIdを介することでcornerstoneStreamingImageVolumeスキームが付されたvolumeをロードすることができます。

```
const volumeId = 'cornerstoneStreamingImageVolume:myVolumeId';

const volume = await volumeLoader.createAndCacheVolume(volumeId, {
  imageIds: imageIds,
});
```
## Default unknown volume loaderとは
あるスキームにおいてvolumeLoaderが見つからない場合は、 デフォルトでunknownVolumeLoader使用されます。
cornerstoneStreamingImageVolumeLoaderはデフォルトの不明なボリュームローダーになります。

# Cache

キャッシュ API の役割は、作成されたボリュームを追跡し、メモリ使用量を管理し、アプリケーションで定義された制限を超えるデータを割り当てようとしたときにホスト アプリケーションに警告することです。

このモジュールはイメージとボリュームのキャッシュを扱います

キャッシュには、イメージの揮発性部分とボリュームの不揮発性部分の 2 つの主要コンポーネントがあります。キャッシュ全体にメモリの共有ブロック（イメージとボリュームに共有される 1GB など）を割り当てます。

個々の 2D 画像は揮発性であるため、キャッシュにヒットする新しい画像に置き換えられます。
ボリュームを割り当てる場合、ボリュームは不揮発性であり、キャッシュからメモリのブロックを予約します。ボリュームは手動で解放する必要があります。

# Cache用ユーティリティ関数

キャッシュの管理に使用できるさまざまなユーティリティ関数があります。

- isCacheableCache : API が提供する多くのユーティリティ関数の 1 つで、isCacheableボリュームまたはイメージのフェッチを開始する前に十分な空き領域があるかどうかを確認するために使用できます。

- purgeCache : キャッシュ内のすべてのイメージとボリュームを削除します。
- decacheIfNecessaryUntilBytesAvailable : 要求されたバイト数に基づいて、必要に応じてキャッシュをパージします。

# Cacheの最適化

Cornerstone3Dイメージとボリュームをロードするためのさまざまなキャッシュの最適化をサポートします。

## イメージをロードする

imageLoadersで新しい画像をリクエストするとき、Cornerstone3Dは同じimageIdを含む画像がvolumeCacheの中にすでにキャッシュされたVolumeがあるどうかを確認します。見つかった場合、イメージに対してネットワーク要求は発行されず、pixelData がボリュームからコピーされます。

画像をロードする詳細な手順は次のとおりです。

単一のイメージに対して十分な未割り当て + 揮発性スペースがあるかどうかを確認します

### もしそうなら：

- 画像を画像キャッシュに割り当て、必要に応じて、maximumCacheSize 基準に一致するように最も古い画像がキャッシュから削除されます。
- ボリュームにその imageId が含まれている場合は、TypedArray の set メソッドを使用してそれを上書きコピーします。
imageId が含まれるボリュームがない場合、イメージはイメージ ローダーによってフェッチされます。


### そうでない場合 (キャッシュはボリュームでほとんどまたは完全に一杯な場合)

- キャッシュに画像を割り当てるのに十分な作業領域がないことをスローします。

## Volumeをロードする

また、一連の imageId を使用してボリュームをリクエストすると、imageCache内の検索がトリガーされます。イメージがすでにリクエストされてキャッシュされている場合は、そのピクセルデータが使用され、ボリューム内の正しい位置に挿入されます。


イメージのセットを含むボリュームをロードする詳細な手順は次のとおりです。

ボリュームを割り当てるのに十分な未割り当て + 揮発性スペースがあるかどうかを確認します。

### もしそうなら：

- ボリュームに十分な空き領域が確保されるまで、このボリュームに含まれない最も古いイメージをデキャッシュします。
- 以前のスペースから十分なスペースがない場合は、十分な空きスペースができるまで、ボリュームに含まれるイメージをデキャッシュします (これらは再フェッチする必要がありますが、たとえアプリがクラッシュする可能性があるため、短時間で行ってください)
- この時点で、いずれかのフレーム (imageId によってインデックス付けされている) が揮発性イメージ キャッシュに存在する場合は、これらをボリュームにコピーします。

### そうでない場合 (キャッシュはボリュームでほとんどまたは完全にいっぱいです)

- ボリュームを割り当てるのに十分な作業スペースがキャッシュにないことを示します。