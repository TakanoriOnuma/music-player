import Dexie, { type EntityTable } from "dexie";

/** タグ */
export type Tag = {
  /** ID */
  id: number;
  /** 名前 */
  name: string;
};

/** 音楽 */
export type Music = {
  /** ID */
  id: number;
  /** タイトル */
  title: string;
  /** タグIDリスト */
  tagIds: number[];
  /** 音楽データ */
  file: File;
};

export const db = new Dexie("MusicPlayer") as Dexie & {
  tags: EntityTable<Tag, "id">;
  musics: EntityTable<Music, "id">;
};
db.version(1).stores({
  tags: "++id, name",
  musics: "++id, title, tags, file",
});
