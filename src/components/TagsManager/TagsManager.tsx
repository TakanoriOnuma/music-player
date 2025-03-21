import { FC, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import styles from "./TagsManager.module.scss";
import { db } from "../../db";
import { Chip } from "../Chip";

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
      <div>タグ管理</div>
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
          <li key={tag.id}>
            <Chip
              onDelete={() => {
                db.tags.delete(tag.id);
              }}
            >
              {tag.name}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
};
