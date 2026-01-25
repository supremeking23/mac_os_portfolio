import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";
import type { WindowKey, WindowData, WindowsMap } from "#types";

// Store state (the data portion)
interface WindowsStoreState {
    windows: WindowsMap;
    nextZIndex: number;
}

// Store actions (the methods)
interface WindowsStoreActions {
    openWindow: (windowKey: WindowKey, data?: WindowData) => void;
    closeWindow: (windowKey: WindowKey) => void;
    focusWindow: (windowKey: WindowKey) => void;
}

// Combined store type
type WindowsStore = WindowsStoreState & WindowsStoreActions;

const useWindowsStore = create<WindowsStore>()(
    immer((set) => ({
        // Initial state from constants
        windows: WINDOW_CONFIG as WindowsMap,
        nextZIndex: INITIAL_Z_INDEX + 1,

        // Opens a window and brings it to the front
        openWindow: (windowKey: WindowKey, data: WindowData = null) =>
            set((state) => {
                const win = state.windows[windowKey];
                // Defensive: if the windowKey is invalid, do nothing
                if (!win) return;
                win.isOpen = true;
                win.zIndex = state.nextZIndex;
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

        // Closes a window and resets its z-index
        closeWindow: (windowKey: WindowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                // Defensive: if the windowKey is invalid, do nothing
                if (!win) return;
                win.isOpen = false;
                win.zIndex = INITIAL_Z_INDEX;
                win.data = null;
            }),

        // Brings a window to the front without changing open state
        focusWindow: (windowKey: WindowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                // Defensive: if the windowKey is invalid, do nothing
                if (!win) return;
                win.zIndex = state.nextZIndex++;
            }),
    })),
);

export default useWindowsStore;
