# Rendering Engine

RenderingEngine は
ビューポートを作成させて、
これらのビューポートを画面上の HTML 要素に関連付け、
オフスクリーン WebGL キャンバスを介して、データをこれらの HTML 要素にレンダリングさせます。

RenderingEngine は複数のビューポートをレンダリングできるため、複数のエンジンを作成する必要がないことに注意してください。

例えば、複数のモニターをセットアップしたい場合には、
複数の RenderingEngine のインスタンスも作成することで、
それぞれの WebGL コンテキストをそれぞれのモニターのビューポートにレンダリングできます。

Cornerstone3D では、
RenderingEngine をゼロから構築し、レンダリングのバックボーンとして vtk.js を利用しています。
vtk.js は GPU でアクセラレイトされたレンダリングするためのもので、
それを利用できる 3D レンダリングライブラリです。

# OnScreen and Offscreen Rendering

以前の Cornerstone (レガシー) では、WebGL キャンバスを利用して各ビューポートのデータを処理していました。
そのせいで、ビューポートの数が増加するとうまく拡張できず、
複雑な画像のユースケース (同期されたビューポートなど) では、
画面上のキャンバスに大量の更新が必要になり、結局、ビューポートの数が増加するにつれてパフォーマンスが低下します。

Cornerstone3D では、オフスクリーン キャンバスでデータを処理します。
すべての画面上（オンスクリーン）にあるキャンバスを含む、大きな非表示のキャンバス (オフスクリーン) があることを意味します。
ユーザーがデータを操作するとき、オフスクリーン キャンバス内のそれに対応するピクセルが更新され、
レンダリング時にそれぞれのビューポートごとにオフスクリーンからオンスクリーンにコピーされます。
コピー プロセスは、操作時に各ビューポートを再レンダリングするよりもはるかに高速であるため、パフォーマンスの低下の問題が対処されました。

# Shared Volume Mappers 　共有ボリュームマッパー

vtk.js はレンダリングする際の標準のレンダリング機能を提供します。
加えて Cornerstone3D で Shared Volume Mappers を導入したのは、
データを複製せずに、テクスチャを必要とするビューポートでテクスチャを再利用できるようにするためです。

たとえば、CT (軸方向、矢状方向、冠状方向)と PET (軸方向、矢状方向、冠状方向)およびそれらの重ね合わせ融合 (軸方向、矢状方向、冠状方向) の 3x3 レイアウトを持つ PET-CT・融合の場合、
CT と PET 用に 2 つのボリューム マッパーを個別に作成させ、
融合 Fusion ビューポートは、新しいテクスチャを再作成するのではなく、作成された両方のテクスチャを再利用します。

# 一般的な使用方法

レンダリング エンジンを作成した後、レンダリングするときビューポートをレンダリング エンジンに割り当てます。
Stack あるいは Volume ビューポートを作成するには主に 2 つのアプローチがあります。
これらについてはこれから説明します。

## RenderingEngine のインスタンス化

new RenderingEngine()メソッドを呼び出すことで、RenderingEngine をインスタンス化できます。

```
import { RenderingEngine } from '@cornerstonejs/core';

const renderingEngineId = 'myEngine';
const renderingEngine = new RenderingEngine(renderingEngineId);
```

## viewport を作成する

ビューポートを作成するには、setViewports と enable/disableAPI という 2 つの方法を利用できます。
どちらのメソッドでも、ViewportInput オブジェクトが引数として渡されます。

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

setViewport は一連のビューポート群を一度に作成するのに適しています。
ビューポートの配列を設定した後、
renderingEngine はオフスクリーンキャンバスの大きさをキャンバスのサイズに適応させ、
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

一つ一つのビューポートに対する有効化あるいは無効化を制御するには、
enableElement あるいは disableElement の API を使用できます。
要素を有効にした後、 renderingEngine はそのサイズと状態を新しい要素に適応させます。

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

viewportId を使用してビューポートを無効にする場合は次のようにします。
無効にした後レンダリングエンジンはオフスクリーンキャンバスのサイズを変更します。

```
renderingEngine.disableElement(viewportId: string)
```
