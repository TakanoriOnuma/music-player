import { FC, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import styles from "./TagsManager.module.scss";
import { db } from "../../db";

export type TagsManagerProps = {};

export const TagsManager: FC<TagsManagerProps> = () => {
  const [tagName, setTagName] = useState("");
  const tags = useLiveQuery(async () => {
    return await db.tags.toArray();
  });

  if (tags == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>タグ管理</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          db.tags.add({
            name: tagName,
          });
          setTagName("");
        }}
      >
        <input
          type="text"
          value={tagName}
          placeholder="タグ名"
          onChange={(event) => {
            setTagName(event.target.value);
          }}
        />
        <button disabled={tagName === ""}>追加</button>
      </form>
      <ul className={styles.TagsList}>
        {tags.map((tag) => (
          <li key={tag.id} className={styles.TagsList__item}>
            <div className={styles.TagItem}>
              <div className={styles.TagItem__name}>{tag.name}</div>
              <button
                onClick={() => {
                  const name = window.prompt(
                    "タグ名を入力してください",
                    tag.name
                  );
                  if (name != null) {
                    db.tags.update(tag.id, { name });
                  }
                }}
              >
                編集
              </button>
              <button
                onClick={() => {
                  const result = window.confirm(
                    `「${tag.name}」を削除してもよろしいですか？`
                  );
                  if (result) {
                    db.tags.delete(tag.id);
                  }
                }}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
