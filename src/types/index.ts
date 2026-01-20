// =============================================================================
// Window Types
// =============================================================================

// Valid window keys - must match the keys in WINDOW_CONFIG from constants
// Defined explicitly to avoid circular dependency between types and constants
export type WindowKey =
    | "finder"
    | "contact"
    | "resume"
    | "safari"
    | "photos"
    | "terminal"
    | "txtfile"
    | "imgfile";

// Dock app IDs - includes WindowKey plus dock-only apps like trash
export type DockAppId = WindowKey | "trash";

// Type representing the data that can be passed when opening a window
// You can extend this union to be more specific per window type if needed
export type WindowData = Record<string, unknown> | null;

// Shape of each individual window's state
export interface WindowState {
    isOpen: boolean;
    zIndex: number;
    data: WindowData;
}

// The windows object maps each window key to its state
export type WindowsMap = Record<WindowKey, WindowState>;

// =============================================================================
// Dock Types
// =============================================================================

// Represents an app in the dock
// The `id` can be any DockAppId (WindowKey + dock-only apps like trash)
export interface DockApp {
    id: DockAppId;
    name: string;
    icon: string;
    canOpen: boolean;
}

// Simplified type for toggleApp function parameter
// Only includes the fields needed for the toggle logic
export interface ToggleAppParams {
    id: DockAppId;
    canOpen: boolean;
}
