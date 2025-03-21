import Dexie, { type EntityTable } from "dexie";

/** 音楽 */
export type Music = {
  /** ID */
  id: number;
  /** タイトル */
  title: string;
  /** 音楽データ */
  file: File;
};

export const db = new Dexie("MusicPlayer") as Dexie & {
  musics: EntityTable<Music, "id">;
};
db.version(1).stores({
  musics: "++id, title, file",
});
