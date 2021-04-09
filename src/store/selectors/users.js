export const selectUserNames = state => state.users.users.map(user => user.name);

export const selectUsers = state => state.users.users;

export const selectCurrentUser = state => state.users.currentUser;