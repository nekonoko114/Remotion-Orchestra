🚀 Implementation Plan: Remotion Pixabay Asset Hub
1. プロジェクト概要
Remotionのプレビュー画面上で、Pixabay APIを使用して動画素材を検索・選択し、即座にタイムラインへ反映させる「カスタム・アセット・パネル」を実装する。

2. アーキテクチャ構成
Frontend: Remotion (React)

API: Pixabay Video API

Storage: Remotionプロジェクト内の public/assets/pixabay/ フォルダ（ローカル保存）

#カテゴリ分けでeffectsカテゴリで取得すると
public/assets/pixabay/effects/
#カテゴリ分けでback groundsカテゴリで取得すると
public/assets/pixabay/backgrounds/
#カテゴリ分けでparticlesカテゴリで取得すると
public/assets/pixabay/particles/
#カテゴリ分けでframesカテゴリで取得すると
public/assets/pixabay/frames/


Integration: AbsoluteFill 上のデバッグ用オーバーレイUI

3. タスクリスト（Antigravity用）
Task 1: Pixabay API クライアントの実装
src/lib/pixabay.ts を作成。

orientation: "vertical" をデフォルト設定し、1080:1920素材を優先取得。

category, q (検索ワード) をパラメータとして受け取る関数を定義。

Task 2: 検索パネル UI コンポーネントの作成
src/components/AssetPanel.tsx を作成。

以下の機能を持つUIを構築：

検索キーワード入力欄（Debounce処理付き）。

取得した動画のサムネイルをグリッド表示（2列）。

クリック時に動画URLをプロジェクトへ通知。

process.env.NODE_ENV === 'development' の時のみレンダリングするガード節を挿入。

Task 3: Remotion Composition への統合
Composition.tsx で、現在選択されている動画URLを useState で管理。

<Video src={selectedUrl} /> を配置し、アセットパネルからの選択で即座にプレビューが切り替わるように接続。

Task 4: アセット保存スクリプトの作成 (Node.js)
選択した動画を public/assets/ に直接保存するための scripts/download-asset.js を作成。

fs と axios を使用し、ストリーム形式でSSD（Remotion内フォルダ）へ書き込み。

ファイル名は pixabay_[ID].mp4 形式で一意に管理。

4. 詳細仕様
API パラメータ設定
Base URL: https://pixabay.com/api/videos/

必達パラメータ:

key: (シゲくんのAPIキー)

orientation: vertical

per_page: 20

safesearch: true

UI/UX 要件
パネルは画面右上に position: absolute で固定。

半透明の背景（rgba(0,0,0,0.8)）で視認性を確保。

カテゴリータグ（炎、ハート、魔法、背景）のプリセットボタンを設置。

#APIキー
PIXABAY_API_KEY


<!-- 
q	str	A URL encoded search term. If omitted, all images are returned. This value may not exceed 100 characters.
Example: "yellow+flower"
lang	str	Language code of the language to be searched in.
Accepted values: cs, da, de, en, es, fr, id, it, hu, nl, no, pl, pt, ro, sk, fi, sv, tr, vi, th, bg, ru, el, ja, ko, zh
Default: "en"
id	str	Retrieve individual images by ID.
image_type	str	Filter results by image type.
Accepted values: "all", "photo", "illustration", "vector"
Default: "all"
orientation	str	Whether an image is wider than it is tall, or taller than it is wide.
Accepted values: "all", "horizontal", "vertical"
Default: "all"
category	str	Filter results by category.
Accepted values: backgrounds, fashion, nature, science, education, feelings, health, people, religion, places, animals, industry, computer, food, sports, transportation, travel, buildings, business, music
min_width	int	Minimum image width.
Default: "0"
min_height	int	Minimum image height.
Default: "0"
colors	str	Filter images by color properties. A comma separated list of values may be used to select multiple properties.
Accepted values: "grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"
editors_choice	bool	Select images that have received an Editor's Choice award.
Accepted values: "true", "false"
Default: "false"
safesearch	bool	A flag indicating that only images suitable for all ages should be returned.
Accepted values: "true", "false"
Default: "false"
order	str	How the results should be ordered.
Accepted values: "popular", "latest"
Default: "popular"
page	int	Returned search results are paginated. Use this parameter to select the page number.
Default: 1
per_page	int	Determine the number of results per page.
Accepted values: 3 - 200
Default: 20
callback	string	JSONP callback function name
pretty	bool	Indent JSON output. This option should not be used in production.
Accepted values: "true", "false"
Default: "false"
 -->