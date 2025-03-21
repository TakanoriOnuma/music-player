import { FC, useState } from "react";
import { Tag } from "../../db";

export type TagsFormProps = {
  /** 最初の選択IDリスト */
  initialTagIds: number[];
  /** タグリスト */
  tags: Tag[];
  /**
   * 送信時
   * @param newTagIds - 新しいタグIDリスト
   */
  onSubmit: (newTagIds: number[]) => void;
};

export const TagsForm: FC<TagsFormProps> = ({
  initialTagIds,
  tags,
  onSubmit,
}) => {
  const [tagIds, setTagIds] = useState(initialTagIds);

  return (
    <div>
      <h2>タグの編集</h2>
      <div>
        {tags.map((tag) => (
          <label key={tag.id} style={{ display: "inline-block" }}>
            <input
              type="checkbox"
              checked={tagIds.includes(tag.id)}
              onChange={(event) => {
                if (event.target.checked) {
                  setTagIds([...tagIds, tag.id]);
                } else {
                  setTagIds(tagIds.filter((id) => id !== tag.id));
                }
              }}
            />
            {tag.name}
          </label>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => {
            onSubmit(tagIds);
          }}
        >
          更新
        </button>
      </div>
    </div>
  );
};
