import { FC, ReactNode } from "react";
import styles from "./Chip.module.scss";

export type ChipProps = {
  onDelete?: () => void;
  children?: ReactNode;
};

export const Chip: FC<ChipProps> = ({ onDelete, children }) => {
  return (
    <div className={styles.Chip}>
      {children}
      {onDelete && <div className={styles.Chip__delete} onClick={onDelete} />}
    </div>
  );
};
