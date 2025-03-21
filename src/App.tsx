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
  const musics = useLiveQuery(async () => {
    return await db.musics.toArray();
  });

  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);

  const currentMusic = musics?.[musicIndex];

  if (musics == null) {
    return <div>準備中...</div>;
  }

  return (
    <div>
      <h1>ミュージックプレーヤー</h1>
      <AddMusicFormWithModal />
      <TagsManagerWithModal />
      <hr />
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
      {currentMusic && (
        <MusicPlayer
          music={currentMusic}
          autoPlay={isAutoPlay}
          onEnded={() => {
            setMusicIndex((prev) => {
              return prev + 1;
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
