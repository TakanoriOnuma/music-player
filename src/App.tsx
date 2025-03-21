import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState, useMemo } from "react";
import Modal from "react-modal";

import { db, Music } from "./db";
import { AddMusicForm } from "./components/AddMusicForm";
import { TagsManager } from "./components/TagsManager";
import { MusicItemList } from "./components/MusicItemList";

Modal.setAppElement("#root");

const AddMusicFormWithModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        音楽追加
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <AddMusicForm />
      </Modal>
    </>
  );
};

const TagsManagerWithModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        タグ管理
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <TagsManager />
      </Modal>
    </>
  );
};

const MusicPlayer: FC<{
  music: Music;
  autoPlay?: boolean;
  onEnded?: () => void;
}> = ({ music, autoPlay, onEnded }) => {
  const url = useMemo(() => {
    return URL.createObjectURL(music.file);
  }, [music.file]);

  return (
    <div>
      <div>{music.title}</div>
      <audio src={url} controls autoPlay={autoPlay} onEnded={onEnded} />
    </div>
  );
};

function App() {
  const [filterTagId, setFilterTagId] = useState<number | null>(null);

  const tags = useLiveQuery(async () => {
    return await db.tags.toArray();
  });
  const musics = useLiveQuery(async () => {
    return await db.musics
      .filter((music) => {
        if (filterTagId == null) {
          return true;
        }

        const id = Number(filterTagId);
        return music.tagIds.includes(id);
      })
      .toArray();
  }, [filterTagId]);

  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);

  const currentMusic = musics?.[musicIndex];

  if (musics == null || tags == null) {
    return <div>準備中...</div>;
  }

  return (
    <div>
      <h1>音楽プレーヤー</h1>
      <div>
        <AddMusicFormWithModal />
        <TagsManagerWithModal />
      </div>
      <hr />
      <div>
        <label>
          絞り込み:
          <select
            value={filterTagId != null ? String(filterTagId) : ""}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              setFilterTagId(Number.isNaN(value) ? null : value);
              setIsAutoPlay(false);
              setMusicIndex(0);
            }}
          >
            <option value="">全て</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <MusicItemList
        selectedIndex={musicIndex}
        musics={musics}
        onSelectMusic={(_, index) => {
          setMusicIndex(index);
        }}
      />
      <hr />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isAutoPlay}
            onChange={(event) => {
              setIsAutoPlay(event.target.checked);
            }}
          />
          自動再生
        </label>
        <button
          disabled={musicIndex <= 0}
          onClick={() => {
            setMusicIndex((prev) => {
              return prev - 1;
            });
          }}
        >
          前へ
        </button>
        <button
          disabled={musicIndex >= musics.length - 1}
          onClick={() => {
            setMusicIndex((prev) => {
              return prev + 1;
            });
          }}
        >
          次へ
        </button>
      </div>
      {currentMusic != null ? (
        <MusicPlayer
          music={currentMusic}
          autoPlay={isAutoPlay}
          onEnded={() => {
            if (isAutoPlay) {
              setMusicIndex((prev) => {
                return prev + 1;
              });
            }
          }}
        />
      ) : (
        <div>音楽を選択してください</div>
      )}
    </div>
  );
}

export default App;
