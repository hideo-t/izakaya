# 🍶 居酒屋ドリフター（プロトタイプ版）

ふざけ半分、本気半分で学ぶ居酒屋経営シミュレーションゲーム

## 🎮 プレイ方法

### ローカルで遊ぶ
1. 3つのファイル（index.html, style.css, game.js）を同じフォルダに配置
2. `index.html` をブラウザで開く
3. スマホで遊ぶ場合は、スマホに転送してブラウザで開く

### GitHub Pagesで公開
```bash
# 1. GitHubでリポジトリを作成（例: izakaya-drifter）

# 2. ローカルで初期化
git init
git add .
git commit -m "feat: 居酒屋ドリフター プロトタイプ完成"

# 3. GitHubにプッシュ
git remote add origin https://github.com/あなたのユーザー名/izakaya-drifter.git
git branch -M main
git push -u origin main

# 4. GitHub Pagesを有効化
# リポジトリの Settings > Pages > Source を "main branch" に設定

# 5. アクセス
# https://あなたのユーザー名.github.io/izakaya-drifter/
```

## 🎯 ゲームの目標

- **資金500万円達成** で勝利！
- **資金がマイナス** になったらゲームオーバー
- 毎月の固定費（10万円）を払い続けられるように経営する

## 🔧 このプロトタイプの機能

✅ **実装済み**
- 基本的な日次進行システム
- 4つのアクション（仕入れ、研修、メニュー改善、休業）
- 簡易的な営業シミュレーション
- 曜日による客数変動
- 人気度・士気のパラメータ管理
- 自動セーブ/ロード機能
- スマホ対応のレスポンシブUI

🚧 **今後の拡張予定**
- キャラクター会話システム
- イベント発生
- ミニゲーム
- メニュー選択機能
- スタッフ管理の詳細化
- エンディング分岐

## 📱 動作環境

- モダンブラウザ（Chrome, Safari, Firefox, Edge）
- スマートフォン対応
- インターネット接続不要（オフラインで遊べます）

## 🛠️ 技術スタック

- HTML5
- CSS3（Flexbox, Grid）
- Vanilla JavaScript（ライブラリなし）
- LocalStorage（セーブデータ保存）

## 📝 ライセンス

MIT License

---

**楽しんでください！🍻**
