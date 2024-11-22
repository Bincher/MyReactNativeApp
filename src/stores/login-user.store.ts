import { create } from 'zustand'
import User from "../types/interface/user.interface";

interface LoginUserStore {
    /// 유저의 정보(id, email, role, profileImage) 제공
    loginUser: User | null;

    /// 유저의 정보(id, email, role, profileImage) 업데이트
    setLoginUser: (loginUser: User) => void;

    /// 유저의 정보(id, email, role, profileImage) 리셋
    resetLoginUser: () => void;
}

const useLoginUserStore = create<LoginUserStore>((set) => ({
    loginUser: null,
    setLoginUser: (loginUser: User) => set(() => ({ loginUser })),  // loginUser의 타입 명시
    resetLoginUser: () => set(() => ({ loginUser: null })),
}));

export default useLoginUserStore;