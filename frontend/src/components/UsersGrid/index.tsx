import React from "react";
import type { User } from "@/types/user";

import type { DynamicGridProps } from "@/components/Base/Layout/DynamicGrid/types";
import DynamicGrid from "@/components/Base/Layout/DynamicGrid";

import UserItem from "./UserItem";

interface UsersGridProps extends DynamicGridProps {
  users: User[];
}

const UsersGrid: React.FC<UsersGridProps> = ({ users, ...props }) => {
  return (
    <DynamicGrid
      autoRows={"250px"}
      gap={"1rem"}
      minRow={"250px"}
      minCol={"250px"}
      {...props}
    >
      {users.map((user) => (
        <UserItem user={user} key={`${user.email}${user.phone}`} />
      ))}
    </DynamicGrid>
  );
};

export default UsersGrid;
