# Personal Trainer System

個人トレーナー向け次世代SaaS - 事務作業ゼロ・未収金ゼロ・催促ストレスゼロを実現するシステム

## プロジェクト概要

このシステムは、1日最大13セッションをこなす多忙な個人トレーナーが「1人ブラック企業」状態から解放され、指導と戦略立案に専念できる環境を提供します。

### 主要機能

1. **インボイス対応・請求作成自動化**
   - 適格請求書の自動生成
   - 「2割特例」対応の税額計算
   - ゼロタッチ領収書発行

2. **予約時デポジット・自動決済**
   - 予約時のクレジットカード情報保持（オーソリ）
   - キャンセルポリシーのデジタル同意
   - セッション完了後のワンタップ決済

3. **未収金自動回収・督促代行**
   - 失敗原因別の自動リトライロジック
   - システムによる機械的な催促通知
   - デジタル取引条件明示

詳細は [docs/overview.md](docs/overview.md) を参照してください。

## 技術スタック

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Architecture**: DDD (Domain-Driven Design)

## ディレクトリ構成

```
personal-trainer-system/
├─ backend/           # バックエンドアプリケーション
├─ docs/              # 設計書・要件定義（時間に依存しない）
├─ logs/              # 作業ログ（時系列）
│  └─ development/    # 開発作業ログ
└─ README.md          # このファイル
```

## ドキュメント構成

### 設計書 (`docs/`)

設計書や要件整理資料は `docs/` ディレクトリ配下に配置しています。

- [docs/overview.md](docs/overview.md) - プロジェクト全体のコンセプトと機能要件
- [docs/billing/design.md](docs/billing/design.md) - 請求機能の設計書

**特徴**:
- ビジネス要件とアーキテクチャ方針を記述
- 時間に依存しない（設計変更まで有効）
- 手動で作成・更新

### 作業ログ (`logs/development/`)

日々の開発作業の記録を時系列で保存しています。

- デバイス間での作業引継ぎ
- 実装判断の理由を記録
- 学習内容の振り返り

**特徴**:
- 時系列に依存（その時点での状態）
- **Claude Codeが自動で記述**
- フォーマットは [logs/development/README.md](logs/development/README.md) を参照

## 開発方針

このプロジェクトは、TypeScript・NestJS・DDD（ドメイン駆動設計）・アジャイル開発を学びながら進めています。

### Claude Codeの役割

Claude Codeには、メンタープログラマーとして以下の役割を期待しています：
- 設計の相談とレビュー
- ベストプラクティスの提案
- コードの改善案の提示（チャット内でお手本コードを提示）
- 技術的な疑問への回答
- デザインパターンの学習支援（必要になったときに都度解説）
- **作業ログの自動記述**

### 実装ルール

**重要**: 学習目的のため、以下のルールに従います。

#### コード実装
- Claude Codeはコードを直接ファイルに実装**しない**
- チャット内でお手本コードを提示
- 開発者が写経して学習（写経による学習を重視）

#### 作業ログ
- Claude Codeが自動で記述
- `logs/development/` 配下に日付ごとに保存
- 実装判断の理由や学びを記録

#### デザインパターン
- 事前に知識をかき集めることは期待しない
- 必要になったときにリファクタリングで導入
- その都度、Claude Codeが解説

### 実装の進め方

1. 開発者が実装方法を考えてClaude Codeに共有する
2. Claude Codeが実装方法に対してフィードバックする
3. 開発者がファイルを指定して、お手本コード（1ファイルのみ）の生成を依頼する
4. Claude Codeがお手本コードとコードの解説を提示する
5. 開発者が解説を基に質問する
6. Claude Codeが質問に回答する
7. 開発者が次の実装に進む指示を出す
8. 手順1に戻る

## セットアップ

### 前提条件

- Node.js 18以上
- PostgreSQL 14以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd personal-trainer-system

# バックエンドの依存関係をインストール
cd backend
npm install

# Prisma Clientを生成
npx prisma generate

# データベースのマイグレーション
npx prisma migrate dev
```

### 環境変数

`backend/.env` ファイルを作成し、以下を設定してください：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/personal_trainer_db"
```

### 開発サーバーの起動

```bash
cd backend
npm run start:dev
```

## 作業終了時のルーティン

```bash
# 1. 実装したコードをコミット
git add .
git commit -m "実装内容の簡潔な説明"

# 2. 作業ログはClaude Codeが自動記述
# （logs/development/YYYY-MM-DD.md が生成される）

# 3. プッシュ（デバイス間で同期）
git push origin main
```

## 参考資料

- [NestJS公式ドキュメント](https://docs.nestjs.com/)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)

## ライセンス

UNLICENSED
