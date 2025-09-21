import { create } from "zustand";

interface ProjectState {
  project: {
    name: string;
    floors: number;
    far: number;
    usage: {
      residential: number;
      commercial: number;
      office: number;
    };
    financial: {
      discountRate: number;
      inflation: number;
      rentalGrowth: number;
      exitCap: number;
      managementFee: number;
      vacancy: number;
    };
  };
  setProject: (key: string, value: any) => void;
}

export const useStore = create<ProjectState>((set) => ({
  project: {
    name: "مشروع جديد",
    floors: 10,
    far: 2.5,
    usage: {
      residential: 40,
      commercial: 30,
      office: 30,
    },
    financial: {
      discountRate: 8,
      inflation: 2,
      rentalGrowth: 3,
      exitCap: 6,
      managementFee: 5,
      vacancy: 10,
    },
  },
  setProject: (key, value) =>
    set((state) => {
      const keys = key.split(".");
      let updatedProject = { ...state.project };

      if (keys.length === 1) {
        (updatedProject as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        (updatedProject as any)[keys[0]][keys[1]] = value;
      }
      return { project: updatedProject };
    }),
}));
