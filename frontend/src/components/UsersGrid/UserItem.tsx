import React from "react";
import type { User } from "@/types/user";
import { Call } from "iconsax-react";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  return (
    <div className="p-6 bg-content1 shadow-sm rounded-xl transition hover:scale-95  duration-300 hover:bg-primary hover:text-primary-foreground">
      <h5 title={user.email} className="truncate text-center">
        {user.email}
      </h5>
      <p
        title={user.phone.toString()}
        className="mt-2 truncate flex gap-1 justify-center items-center"
      >
        <span className="text-secondary text-2xl">
          <Call size="1em" variant="Bold" />
        </span>
        <b>+{user.phone}</b>
      </p>
    </div>
  );
};

export default UserItem;
