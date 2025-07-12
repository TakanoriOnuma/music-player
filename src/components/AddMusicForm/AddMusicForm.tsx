import { FC, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../../db";

export type AddMusicFormProps = {};

export const AddMusicForm: FC<AddMusicFormProps> = () => {
  const tags = useLiveQuery(async () => {
    return await db.tags.toArray();
  });
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  if (tags == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>音楽追加</h2>
      <div>追加するタグ</div>
      <div>
        {tags.map((tag) => (
          <label key={tag.id} style={{ display: "inline-block" }}>
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedTagIds([...selectedTagIds, tag.id]);
                } else {
                  setSelectedTagIds(
                    selectedTagIds.filter((id) => id !== tag.id)
                  );
                }
              }}
            />
            {tag.name}
          </label>
        ))}
      </div>
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.m4a"
        multiple
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          // 同じファイルをアップロードできるようにリセットする
          // https://qiita.com/_Keitaro_/items/57b1c5dd36b7bed08ad8
          event.target.value = "";

          files.forEach((file) => {
            db.musics.add({
              title: file.name,
              tagIds: selectedTagIds,
              file,
            });
          });
        }}
      />
    </div>
  );
};
