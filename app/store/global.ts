import { create } from "zustand";

interface GlobalState {
  openedFolder: {
    title: string;
    url: string;
  };
}

interface Actions {
  setOpenedFolder: (title: string, url: string) => void;
  resetOpenedFolder: () => void;
}
const g = create<GlobalState & Actions>((set, get) => ({
  openedFolder: {
    title: "",
    url: "",
  },
  setOpenedFolder: (title, url) => {
    set((state) => ({
      ...state,
      openedFolder: {
        title,
        url,
      },
    }));
  },
  resetOpenedFolder: () => {
    set((state) => ({
      ...state,
      openedFolder: {
        title: "",
        url: "",
      },
    }));
  },
}));

export default g;
