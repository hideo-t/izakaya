# 🍶 居酒屋ドリフター 〜ダメ社長の経営革命〜

![バージョン](https://img.shields.io/badge/version-2.0.0-orange)
![ライセンス](https://img.shields.io/badge/license-MIT-blue)
![対応デバイス](https://img.shields.io/badge/device-mobile%20optimized-green)

## 概要

**居酒屋ドリフター**は、笑って、悩んで、気づく本格派居酒屋経営シミュレーションゲームです。

スマホ最適化・PWA対応で、いつでもどこでも本格的な飲食店経営を体験できます。

### ✨ 特徴

- 📊 **リアルな経営指標** - 原価率・FL比率・回転率など本格的な計算
- 🤖 **自動運転モード** - AIが自動で経営判断（3つの戦略から選択）
- 📱 **スマホ最適化** - タッチ操作に最適化されたUI
- 📈 **グラフ表示** - Chart.jsによる美しい売上推移グラフ
- 🎲 **ランダムイベント** - 予期せぬ出来事で経営に変化
- 💾 **自動セーブ** - プレイ状況を自動保存
- 🎮 **タブ切り替え** - ダッシュボード・メニュー・スタッフ・マーケティング・分析

## 🎮 プレイ方法

### ⚡ 簡易版（推奨）

Chart.jsが読み込めない環境や、シンプルに遊びたい場合：

```bash
# index-simple.html を開く
open index-simple.html
```

グラフ表示以外はすべて動作します！

### 📊 完全版（グラフ付き）

```bash
# HTTPサーバーで起動（推奨）
python3 -m http.server 8000
# ブラウザで http://localhost:8000
```

### ローカルで遊ぶ

```bash
# 1. リポジトリをクローン
git clone https://github.com/あなたのユーザー名/izakaya-drifter.git
cd izakaya-drifter

# 2. HTTPサーバーで起動
python3 -m http.server 8000

# 3. ブラウザでアクセス
open http://localhost:8000
```

### スマホで遊ぶ

1. すべてのファイルをスマホに転送
2. ブラウザで `index.html` を開く
3. 「ホーム画面に追加」でアプリ化可能（PWA対応）

### GitHub Pagesで公開

```bash
# 1. GitHubでリポジトリを作成

# 2. プッシュ
git add .
git commit -m "feat: 居酒屋ドリフター フル機能版"
git push origin main

# 3. Settings > Pages > Source を "main branch" に設定

# 4. 公開URL
https://あなたのユーザー名.github.io/izakaya-drifter/
```

## 🎯 ゲームの目標

- **資金1000万円達成** で大成功エンディング
- **資金マイナス50万円** でゲームオーバー
- 毎月の固定費（10万円）を払い続ける
- 利益率15%以上を維持する

## 📊 主要機能

### ダッシュボード
- リアルタイム経営指標（月商・利益率・リピート率・人気度）
- 社長メッセージ
- 1週間進めるボタン
- 自動運転ON/OFF
- 売上推移グラフ
- 経営日誌

### メニュー管理
- 看板メニュー設定
- 全メニュー一覧（原価率表示）
- 新メニュー開発（¥50,000）
- 平均原価率チェック

### スタッフ管理
- スタッフカード（源さん・みゆき・タケシ）
- 士気ゲージ表示
- シフト設定（開店・閉店時間）
- 平均士気チェック

### マーケティング
- SNS投稿（無料、フォロワー増加）
- 広告出稿（SNS: ¥30,000 / 地域誌: ¥100,000）
- フォロワー数表示

### 経営分析
- FL比率（食材費+人件費）
- 客単価
- 回転率
- 座席数
- コンサルタントからの改善提案

## 🤖 自動運転モード

AIがあなたの代わりに経営判断を行います。

### 戦略タイプ
1. **バランス型（デフォルト）** - FL比率やモラルを管理
2. **利益重視** - 原価率を下げて利益率を最大化
3. **人気重視** - SNSやメニュー品質に投資

### 使い方
1. 「🤖 自動運転」ボタンをクリック
2. 自動的に週が進み、AIが経営判断
3. もう一度クリックで停止

## 📱 技術スタック

- **HTML5/CSS3** - モバイルファースト設計
- **Vanilla JavaScript** - フレームワークなし
- **Chart.js** - グラフ描画ライブラリ
- **LocalStorage** - セーブデータ保存
- **PWA** - オフライン対応・ホーム画面追加可能

## 🎨 ファイル構成

```
izakaya-drifter/
├── index.html           # メインHTML
├── style.css            # メインスタイル
├── components.css       # コンポーネントスタイル
├── manifest.json        # PWAマニフェスト
├── game.js              # ゲームコアロジック
├── auto-pilot.js        # 自動運転システム
├── calculator.js        # 経営計算エンジン
├── ui-manager.js        # UI管理
├── main.js              # エントリーポイント
└── README.md            # このファイル
```

## 🐛 デバッグコマンド

ブラウザコンソールで以下のコマンドが使えます：

```javascript
// 資金追加
debugGame.addCash(100000);

// 人気度設定
debugGame.setPopularity(80);

// 1ヶ月進める
debugGame.advanceMonth();

// 経営診断
debugGame.diagnose();

// ABC分析
debugGame.abcAnalysis();

// 状態確認
debugGame.showState();
```

## 🚀 今後の拡張予定

- [ ] 社長成長ストーリー（覚醒システム）
- [ ] 50種類のエンディング
- [ ] より詳細なイベントシステム
- [ ] ミニゲーム（クレーム処理・原価計算）
- [ ] マルチエンディング分岐
- [ ] 実績システム
- [ ] サウンドエフェクト

## 🐛 トラブルシューティング

### スプラッシュ画面から進まない場合

**解決方法1: 簡易版を使う**
```bash
# index-simple.html を開く
open index-simple.html
```

**解決方法2: HTTPサーバー経由で開く**
```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000
```

**解決方法3: ブラウザのコンソールを確認**
1. F12キーでデベロッパーツールを開く
2. Console タブでエラーメッセージを確認
3. エラー内容をIssueで報告

### よくある問題

**Q: グラフが表示されない**
A: Chart.jsの読み込みに失敗しています。簡易版（index-simple.html）を使うか、HTTPサーバー経由でアクセスしてください。

**Q: ファイルをダブルクリックしても動かない**
A: ブラウザのセキュリティ制限のため、HTTPサーバー経由でアクセスしてください。

**Q: スマホで動かない**
A: ブラウザで直接 index-simple.html を開いてください。

## 📝 ライセンス

MIT License

## 🙏 クレジット

- ゲームデザイン・開発: Claude + あなた
- Chart.js: https://www.chartjs.org/
- アイコン: emoji

---

**楽しんでください！🍻**

何か問題があれば Issue を作成してください。
