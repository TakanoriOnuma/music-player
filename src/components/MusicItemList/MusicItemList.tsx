import { FC } from "react";

import styles from "./MusicItemList.module.scss";
import { Music } from "../../db";
import { MusicItem } from "./subComponents/MusicItem";

export type MusicItemListProps = {
  /** 選択中のindex */
  selectedIndex: number;
  /** 音楽リスト */
  musics: Music[];
  /**
   * 音楽選択時
   * @param music - 音楽
   * @param index - index値
   */
  onSelectMusic: (music: Music, index: number) => void;
};

export const MusicItemList: FC<MusicItemListProps> = ({
  selectedIndex,
  musics,
  onSelectMusic,
}) => {
  return (
    <ul className={styles.MusicItemList}>
      {musics.map((music, index) => (
        <li key={music.id} className={styles.MusicItemList__item}>
          <MusicItem
            isSelected={index === selectedIndex}
            music={music}
            onClick={() => {
              onSelectMusic(music, index);
            }}
          />
        </li>
      ))}
    </ul>
  );
};
