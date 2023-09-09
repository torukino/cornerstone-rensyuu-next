# Rendering Engine

RenderingEngine によりユーザーはビューポートを作成し、
これらのビューポートを画面上の HTML 要素に関連付け、オフスクリーン WebGL キャンバスを使用してこれらの要素にデータをレンダリングできるようになります。

RenderingEngine は複数のビューポートをレンダリングできるため、複数のエンジンを作成する必要がないことに注意してください。しかしながら、複数の RenderingEngine のインスタンスも作成できます。
つまりもしモニターをセットアップしたい場合、個別の WebGL コンテキストを使用して各モニターのビューポートをレンダリングできます。

Cornerstone3D では、
RenderingEngine をゼロから構築し、レンダリングのバックボーンとして vtk.js を利用しています。
vtk.js は GPU アクセラレイトされたレンダリング用の WebGL を使用できる 3D レンダリングライブラリです。

# OnScreen and Offscreen Rendering

以前の Cornerstone (レガシー) では、WebGL キャンバスを使用して各ビューポートのデータを処理していました。これは、ビューポートの数が増加するにつれてうまく拡張できず、複雑なイメージングのユースケース (同期されたビューポートなど) では、結局、画面上のキャンバスに大量の更新が必要になり、ビューポートの数が増加するにつれてパフォーマンスが低下します。

Cornerstone3Dでは、オフスクリーン キャンバスでデータを処理します。これは、その内部にすべての画面上のキャンバスを含む、大きな非表示のキャンバス (オフスクリーン) があることを意味します。ユーザーがデータを操作すると、オフスクリーン キャンバス内の対応するピクセルが更新され、レンダリング時にビューポートごとにオフスクリーンからオンスクリーンにコピーします。コピー プロセスは、操作時に各ビューポートを再レンダリングするよりもはるかに高速であるため、パフォーマンスの低下の問題に対処しました。

# Shared Volume Mappers

vtk.jsはレンダリングに使用する標準のレンダリング機能を提供します。
さらにCornerstone3Dでは、データを複製せずに、テクスチャを必要とする可能性のあるビューポートでテクスチャを再利用できるようにShared Volume Mappersを導入しました。

たとえば、CT (軸方向、矢状方向、冠状方向)、PET (軸方向、矢状方向、冠状方向)、および融合 (軸方向、矢状方向、冠状方向) を含む 3x3 レイアウトを持つ PET-CT 融合の場合、CT と PET 用に 2 つのボリューム マッパーを個別に作成します。また、Fusion ビューポートの場合は、新しいテクスチャを再作成するのではなく、作成された両方のテクスチャを再利用します。

# 一般的な使用方法

レンダリング エンジンを作成した後、レンダリングのためにビューポートをそれに割り当てることができます。StackあるいはVolumeビューポートを作成するには主に 2 つのアプローチがあります。これらについてはこれから説明します。

## RenderingEngineのインスタンス化
new RenderingEngine()メソッドを呼び出すことで、RenderingEngineをインスタンス化できます。
```
import { RenderingEngine } from '@cornerstonejs/core';

const renderingEngineId = 'myEngine';
const renderingEngine = new RenderingEngine(renderingEngineId);
```

## viewportを作成する

ビューポートを作成するには、setViewportsとenable/disableAPIという2つの方法を使用できます。どちらのメソッドでも、ViewportInput オブジェクトが引数として渡されます。

```
PublicViewportInput = {
  /** HTML element in the DOM */
  element: HTMLDivElement
  /** unique id for the viewport in the renderingEngine */
  viewportId: string
  /** type of the viewport VolumeViewport or StackViewport*/
  type: ViewportType
  /** options for the viewport */
  defaultOptions: ViewportInputOptions
}
```

### setViewports

setViewpoは一度に一連のビューポートを作成するのに適しています。ビューポートの配列を設定した後、 
renderingEngineはオフスクリーンキャンバスの大きさをキャンバスのサイズに適応させ、
対応するイベントをトリガーします。

```
const viewportInput = [
  // CT Volume Viewport - Axial
  {
    viewportId: 'ctAxial',
    type: ViewportType.ORTHOGRAPHIC,
    element: htmlElement1,
    defaultOptions: {
      orientation: Enums.OrientationAxis.AXIAL,
    },
  },
  // CT Volume Viewport - Sagittal
  {
    viewportId: 'ctSagittal',
    type: ViewportType.ORTHOGRAPHIC,
    element: htmlElement2,
    defaultOptions: {
      orientation: Enums.OrientationAxis.SAGITTAL,
    },
  },
  // CT Axial Stack Viewport
  {
    viewportId: 'ctStack',
    type: ViewportType.STACK,
    element: htmlElement3,
    defaultOptions: {
      orientation: Enums.OrientationAxis.AXIAL,
    },
  },
];

renderingEngine.setViewports(viewportInput);
```

### Enable/Disable API

各ビューポートの有効化/無効化を個別に完全に制御するには、
enableElementとdisableElementのAPI を使用できます。
要素を有効にした後、 renderingEngineはそのサイズと状態を新しい要素に適応させます。

```
const viewport = {
  viewportId: 'ctAxial',
  type: ViewportType.ORTHOGRAPHIC,
  element: element1,
  defaultOptions: {
    orientation: Enums.OrientationAxis.AXIAL,
  },
};

renderingEngine.enableElement(viewport);
```

viewportIdを使用してビューポートを無効にできます。
無効にした後レンダリングエンジンはオフスクリーンキャンバスのサイズを変更します。

```
renderingEngine.disableElement(viewportId: string)
```
