const { AccessControl } = require("accesscontrol");

const roles = [
  {
    role: "admin",
    permission: {
      "create-user": "*",
      "update-user": "*",
      "delete-user": "*",
    },
  },
  {
    role: "user",
    permission: {
      "update-user": ["own"],
    },
  },
];

const accessControl = new AccessControl(roles);

accessControl
  .grant("admin")
  .createAny("user")
  .updateAny("user")
  .deleteAny("user");
