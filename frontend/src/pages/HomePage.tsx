import { useCallback, useEffect, useRef, useState } from "react";
import { isCancel } from "axios";

import { type FormData, createSection, Form } from "@/components/Base/Form";
import type { User, UserListResponse } from "@/types/user";

import { Spinner } from "@nextui-org/react";
import UsersGrid from "@/components/UsersGrid";

import { axios } from "@/utils/request";
import { useToastStore } from "@/stores/toastStore";

const searchStructure = createSection({
  fields: {
    email: {
      widget: "email",
      showLabel: false,
    },
    phone: {
      widget: "phone",
      isRequired: false,
      showLabel: false,
    },
  },
});

type SearchStructure = typeof searchStructure;
type SearchData = FormData<SearchStructure>;

const HomePage = () => {
  const showInfo = useToastStore.use.showInfo();
  const showWarning = useToastStore.use.showWarning();
  const showError = useToastStore.use.showError();

  const [users, setUsers] = useState<User[]>();
  const [fetching, setFetching] = useState<boolean>(false);
  const controllerRef = useRef<AbortController>();

  const getController = useCallback((): AbortController => {
    const oldController = controllerRef.current;
    if (oldController && !oldController.signal.aborted) {
      oldController.abort();
    }

    const newController = (controllerRef.current = new AbortController());

    const signal = newController.signal;

    const timeId = setTimeout(() => {
      if (!signal.aborted) {
        newController.abort("timeout");
        showInfo("Request Timed out");
      }
    }, 20e3);

    newController.signal.addEventListener("abort", () => clearTimeout(timeId));

    return newController;
  }, []);

  const fetchUsers = useCallback(async (searchParams?: URLSearchParams) => {
    const controller = getController();
    const endPoint =
      `users` + (searchParams ? `?${searchParams.toString()}` : "");
    setFetching(true);
    try {
      const response = await axios.get<UserListResponse>(endPoint, {
        signal: controller.signal,
      });
      const { data } = response;
      if (!data.count) {
        showWarning("Users haven't been found");
      }
      setUsers(data.results);
    } catch (error) {
      if (isCancel(error)) {
        console.log("Canceled");
        return;
      }

      console.log(error);
      showError("Something went wrong");
    }
    controller.abort();
    setFetching(false);
  }, []);

  const handleSearch = useCallback(async (data: SearchData) => {
    const searchParams = new URLSearchParams(data as {});
    fetchUsers(searchParams);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-[550px] mx-auto p-6 bg-content1 rounded-xl shadow-sm">
        <h2 className="text-center mb-6 mt-2 text-primary">Search People</h2>
        <Form
          structure={searchStructure}
          submitTitle="Search"
          validated={handleSearch}
        />
      </div>
      <div className="max-w-screen-xl mx-auto mt-4">
        {fetching ? (
          <div className="text-center">
            <Spinner size="lg" color="primary" />
          </div>
        ) : users && users.length ? (
          <UsersGrid users={users} className="mt-6" />
        ) : (
          <h2 className="text-center h3">Not Found</h2>
        )}
      </div>
    </div>
  );
};

export default HomePage;
