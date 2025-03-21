import { useLiveQuery } from "dexie-react-hooks";
import {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  ForwardedRef,
  useEffect,
} from "react";
import Modal from "react-modal";

import { db, Music } from "./db";
import { AddMusicForm } from "./components/AddMusicForm";
import { TagsManager } from "./components/TagsManager";

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

type MusicItemHandler = {
  id: number;
  play: () => void;
};

type MusicItemProps = {
  ref?: ForwardedRef<MusicItemHandler>;
  music: Music;
  onEnded?: () => void;
};

const MusicItem: FC<MusicItemProps> = ({ ref, music, onEnded }) => {
  const elAudioRef = useRef<HTMLAudioElement | null>(null);

  const url = useMemo(() => {
    return URL.createObjectURL(music.file);
  }, [music.file]);

  const play: MusicItemHandler["play"] = useCallback(() => {
    elAudioRef.current?.play();
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        id: music.id,
        play,
      };
    },
    [music.id, play]
  );

  useEffect(() => {
    const elAudio = elAudioRef.current;
    if (elAudio == null) {
      return;
    }

    if (onEnded != null) {
      elAudio.addEventListener("ended", onEnded);
    }

    return () => {
      if (onEnded != null) {
        elAudio.removeEventListener("ended", onEnded);
      }
    };
  }, [onEnded]);

  return (
    <div>
      <div>{music.title}</div>
      <audio ref={elAudioRef} src={url} controls />
    </div>
  );
};

function App() {
  const musics = useLiveQuery(async () => {
    return await db.musics.toArray();
  });

  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);

  const musicHandlersRef = useRef<Record<number, MusicItemHandler>>({});

  const handleRef = useCallback((musicHandler: MusicItemHandler | null) => {
    console.log(musicHandler);
    if (musicHandler == null) {
      return;
    }

    musicHandlersRef.current[musicHandler.id] = musicHandler;
    return () => {
      delete musicHandlersRef.current[musicHandler.id];
    };
  }, []);

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
      <hr />
      <ul>
        {musics?.map((music) => {
          return (
            <li key={music.id}>
              <MusicItem
                ref={handleRef}
                music={music}
                onEnded={() => {
                  console.log("ended");

                  const music = musics?.[1];
                  if (music == null) {
                    return;
                  }

                  const musicHandler = musicHandlersRef.current[music.id];
                  if (musicHandler == null) {
                    return;
                  }

                  musicHandler.play();
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
