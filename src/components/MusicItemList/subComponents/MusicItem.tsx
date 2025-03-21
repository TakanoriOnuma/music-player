import { FC, useState } from "react";
import { clsx } from "clsx";
import Modal from "react-modal";

import styles from "./MusicItem.module.scss";
import { db, Music, Tag } from "../../../db";
import { Chip } from "../../Chip";
import { TagsForm } from "../../TagsForm";

export type MusicItemProps = {
  /** 選択中か */
  isSelected?: boolean;
  /** 音楽 */
  music: Music;
  /** タグ一覧 */
  tags: Tag[];
  /**
   * クリック時
   */
  onClick?: () => void;
};

export const MusicItem: FC<MusicItemProps> = ({
  isSelected,
  music,
  tags,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={clsx(styles.MusicItem, {
          [styles._selected]: isSelected,
        })}
        onClick={onClick}
      >
        <div className={styles.MusicItem__header}>
          <div className={styles.MusicItem__header__title}>{music.title}</div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              const result = window.confirm(
                `「${music.title}」を削除しますか？`
              );
              if (result) {
                db.musics.delete(music.id);
              }
            }}
          >
            削除
          </button>
        </div>
        <ul className={styles.MusicItemTags}>
          {music.tagIds.map((tagId) => {
            const tag = tags.find((tag) => tag.id === tagId);
            return (
              <li key={tagId} className={styles.MusicItemTags__item}>
                <Chip>{tag?.name}</Chip>
              </li>
            );
          })}
        </ul>
        <button
          style={{ marginTop: 4 }}
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(true);
          }}
        >
          タグの編集
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <TagsForm
          initialTagIds={music.tagIds}
          tags={tags}
          onSubmit={(newTagIds) => {
            db.musics.update(music.id, { tagIds: newTagIds });
            setIsOpen(false);
          }}
        />
      </Modal>
    </>
  );
};
