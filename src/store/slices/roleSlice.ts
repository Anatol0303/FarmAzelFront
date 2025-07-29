import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserRole = 'farmer' | 'client' | null;

interface RoleState {
    role: UserRole;
}

const initialState: RoleState = {
    role: null,
};

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole(state, action: PayloadAction<UserRole>) {
            state.role = action.payload;
        },
        clearRole(state) {
            state.role = null;
        },
    },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
