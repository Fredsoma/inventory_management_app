// types.ts
import { RootState as ReduxRootState } from "@reduxjs/toolkit/query"; // Rename the imported RootState to avoid conflict

export interface GlobalState {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

// Renamed local RootState to GlobalRootState
export interface GlobalRootState {
  global: GlobalState; // Assuming 'global' is the name of your slice
}
