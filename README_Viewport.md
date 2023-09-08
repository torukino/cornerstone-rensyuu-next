# Viewport

ビューポートは次のように考えることができます。

- 特定の視点から画像を表示するカメラ。
- このカメラの出力を表示するキャンバス。

Cornerstone3D ビューポートは HTML 要素から作成され、コンシューマーはビューポートを作成する対象の element を渡す必要があります。たとえば、CT シリーズは、アキシャル MPR、サジタル MPR、コロナル MPR、3D パースペクティブ ボリューム レンダリングの 4 つのビューポートを介して「4 アップ」ビューで表示できます。

![Alt text](https://www.cornerstonejs.org/assets/images/viewports-d8c0751bfa6112731fd73608f79d6e52.png)

## StackViewport

- 同じ画像に属している場合とそうでない場合がある、画像のスタックをレンダリングするのに適しています。
- スタックには、さまざまな形状、サイズ、方向の 2D 画像を含めることができます

## VolumeViewport

- 1 つの 3D 画像としてみなされるボリュームデータをレンダリングするのに適しています。
- VolumeViewport を使用すると、設計により多平面の再構成(Multi-planar reformation)または再構築 (reconstruction) が可能になり、パフォーマンスコストを追加することなく、さまざまな方向からボリュームを視覚化できます。
- 2 つのシリーズのイメージ融合

## 3D Viewport

- 体積データの実際の 3D レンダリングに適しています。
- 骨、軟組織、肺などのさまざまなタイプのプリセットを使用します。

StackViewport、VolumeViewport、VolumeViewport3D は、API 経由で作成されます。

## 初期表示領域

すべてのビューポートは、提供可能な displayArea フィールドを持つ Viewport クラスを継承します。
このフィールドを使用して、画像の初期ズーム/パンをプログラムで設定できます。
デフォルトでは、ビューポートは dicom 画像を画面に合わせて表示します。
displayArea は次のフィールドを持つ DisplayArea 型を取ります。

```
type DisplayArea = {
  imageArea: [number, number], // areaX, areaY
  imageCanvasPoint: {
    imagePoint: [number, number], // imageX, imageY
    canvasPoint: [number, number], // canvasX, canvasY
  },
  storeAsInitialCamera: boolean,
};
```

ズームとパンはすべて、最初の「画面に合わせる」ビューを基準としています。
画像を 200%ズームするには、imageArea を[0.5, 0.5]に設定します。

パンは提供された imagePoint および提供された canvasPoint によって制御されます。
キャンバスは白い紙のシートで、胸部 X 線写真のような別の紙のシートであると想像してください。
キャンバス紙にペンで点をマークし、胸部 X 線画像上に別の点をマークします。
次に、画像を「パン」して、ポイントが imagePoint と canvasPoint とが一致するようにします。
これが imageCanvasPoint の API 設計で表現されているものです。

したがって、画像を左揃えにしたい場合は、次の値を指定できます。

```
imageCanvasPoint: {
  imagePoint: [0, 0.5], // imageX, imageY
  canvasPoint: [0, 0.5], // canvasX, canvasY
};
```
これは、キャンバス上の左 (0) 中央 (0.5) ポイントが画像上の左 (0) 中央 (0.5) ポイントと位置合わせする必要があることを意味します。値は画像全体の % サイズに基づいています。この例では、1024 x 1024 の X 線画像があるとします。imagePoint は[0, 512]になります。iPhoneモバイルを横向きモード (844 x 390) で使用しているとします。CanvasPoint は[0, 195]になります。