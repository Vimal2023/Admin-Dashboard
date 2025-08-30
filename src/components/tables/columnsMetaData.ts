export const columnsMetaData = [
  {
    key: "name",
    header: "Name",
    type: "string",
    pinned: "left",
    width: 220,
    sorting: true,
  },
  {
    key: "email",
    header: "Email",
    type: "string",
    width: 260,
    sorting: true,
  },
  { key: "status", header: "Status", type: "badge", width: 120 },
  {
    key: "createdAt",
    header: "Joined",
    type: "date",
    format: "YYYY-MM-DD",
    width: 140,
  },
  { key: "groups", header: "Groups", type: "chiplist", width: 280 },
];
