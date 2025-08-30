import { http, HttpResponse } from "msw";
import { data } from "./data";

const userData = data.users.flat();

export const handlers = [
  //get endpoint
  http.get("/api/users", (request) => {
    const url = new URL(request.request.url);
    const query = url.searchParams.get("query")?.toLowerCase() || "";
    console.log("MSW received query:", query);
    const page = parseInt(url.searchParams.get("page") || "0");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    //get the filter data
    const filteredUsers = userData.filter((user) => {
      const searchTerm = query.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchTerm);
      const emailMatch = user.email?.toLowerCase().includes(searchTerm);
      const groupMatch = user.groups?.some((g) =>
        g.name.toLowerCase().includes(searchTerm)
      );

      const roleMatch = user.groups?.some((g) =>
        g.role.toLowerCase().includes(searchTerm)
      );

      return nameMatch || emailMatch || groupMatch || roleMatch;
    });

    //pagination part
    const totalCount = filteredUsers.length;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      totalCount,
      users: paginatedUsers,
    });
  }),

  //patch endpoint
  http.patch("/api/users/:id", ({ params }) => {
    const id = params.id;
    const userToUpdate = userData.find((user) => user.id === id);

    //user not found to update
    if (!userToUpdate) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "User not found",
      });
    }

    userToUpdate.status =
      userToUpdate.status === "active" ? "inactive" : "active";

    return HttpResponse.json(userToUpdate);
  }),
];
