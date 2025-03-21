import { FC } from "react";
import { clsx } from "clsx";

import styles from "./MusicItem.module.scss";
import { Music } from "../../../db";

export type MusicItemProps = {
  /** 選択中か */
  isSelected?: boolean;
  /** 音楽 */
  music: Music;
  /**
   * クリック時
   */
  onClick?: () => void;
};

export const MusicItem: FC<MusicItemProps> = ({
  isSelected,
  music,
  onClick,
}) => {
  return (
    <div
      className={clsx(styles.MusicItem, {
        [styles._selected]: isSelected,
      })}
      onClick={onClick}
    >
      <div>{music.title}</div>
    </div>
  );
};
