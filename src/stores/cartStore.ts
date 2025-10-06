import { create } from "zustand";
import type { Subject } from "@/types/apiTypes";

interface CartState {
	Cart: Array<Subject>;
	setCart: (cart: Array<Subject>) => void;
	addSubjects: (subjects: Array<Subject>) => void;
	clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
	Cart: [],
	setCart: (cart) => set(() => ({ Cart: cart })),
	addSubjects: (subjects) =>
		set((state) => ({
			Cart: [...state.Cart, ...subjects],
		})),
	clearCart: () => set(() => ({ Cart: [] })),
}));
