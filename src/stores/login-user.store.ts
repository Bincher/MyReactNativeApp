
import { create } from 'zustand'
import User from "../types/interface/user.interface";

interface LoginUserStore {
    loginUser: User | null;
    setLoginUser: (loginUser: User) => void;
    resetLoginUser: () => void;
}

const useLoginUserStore = create<LoginUserStore>((set) => ({
    loginUser: null,
    setLoginUser: (loginUser: User) => set(() => ({ loginUser })),  // loginUser의 타입 명시
    resetLoginUser: () => set(() => ({ loginUser: null })),
}));

export default useLoginUserStore;