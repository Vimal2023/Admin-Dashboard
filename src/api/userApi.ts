import type { User } from "../mocks/types";

//This is for production [zero backend]
import { data as localData } from "../mocks/data";
const isProduction = import.meta.env.PROD;
const localUsers = localData.users as User[];

// #DEV#
//api calls to user data get and patch
//get from users
async function getMSWUsers(params: {
  page: number;
  pageSize: number;
  sorting?: unknown;
  query?: string;
}): Promise<{ users: User[]; totalCount: number }> {
  const { page, pageSize, query } = params;
  const queryParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    query: query || "",
  }).toString();
  const response = await fetch(`/api/users?${queryParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const result = await response.json();
  return { users: result.users, totalCount: result.totalCount };
}

//patch to users
const updateMSWUserStatus = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to toggle user status");
  }
  return response.json();
};

// #DEV#

//#PROD#
//get users part
const getLocalUsers = async (params: {
  page: number;
  pageSize: number;
  sorting?: unknown;
  query?: string;
}): Promise<{ users: User[]; totalCount: number }> => {
  const { page, pageSize, query } = params;
  let filteredUsers = localUsers; // Correctly access the 'users' array

  if (query) {
    const q = query.toLowerCase();
    filteredUsers = localUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
    );
  }

  const start = page * pageSize;
  const end = start + pageSize;
  const users = filteredUsers.slice(start, end);

  return { users, totalCount: filteredUsers.length };
};

// patch status part
const updateLocalUserStatus = async (id: string): Promise<User> => {
  const userToUpdate = localUsers.find((user) => user.id === id); // Correctly access the 'users' array
  if (!userToUpdate) {
    throw new Error("User not found");
  }
  userToUpdate.status =
    userToUpdate.status === "active" ? "inactive" : "active";
  return userToUpdate;
};

//#PROD#

export const getUsers = isProduction ? getLocalUsers : getMSWUsers;
export const updateUserStatus = isProduction
  ? updateLocalUserStatus
  : updateMSWUserStatus;
