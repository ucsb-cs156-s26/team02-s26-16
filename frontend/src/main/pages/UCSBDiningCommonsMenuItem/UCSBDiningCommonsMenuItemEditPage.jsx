import React from "react";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage() {
  let { id } = useParams();

  const {
    data: menuItem,
    _error,
    _status,
  } = useBackend(
    [`/api/UCSBDiningCommonsMenuItem?id=${id}`],
    {
      method: "GET",
      url: "/api/UCSBDiningCommonsMenuItem",
      params: {
        id,
      },
    },
    null,
  );

  const objectToAxiosPutParams = (menuItem) => ({
    url: "/api/UCSBDiningCommonsMenuItem",
    method: "PUT",
    params: {
      id: menuItem.id,
    },
    data: {
      diningCommonsCode: menuItem.diningCommonsCode,
      name: menuItem.name,
      station: menuItem.station,
    },
  });

  const onSuccess = (menuItem) => {
    toast(`UCSBDiningCommonsMenuItem Updated - id: ${menuItem.id}`);
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess }, [
    `/api/UCSBDiningCommonsMenuItem?id=${id}`,
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/diningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>
        {menuItem && (
          <UCSBDiningCommonsMenuItemForm
            initialContents={menuItem}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
