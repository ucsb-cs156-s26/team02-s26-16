import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (ucsbdiningcommonsmenuitem) => ({
    url: "/api/UCSBDiningCommonsMenuItem/post",
    method: "POST",
    params: {
      diningCommonsCode: ucsbdiningcommonsmenuitem.diningCommonsCode,
      name: ucsbdiningcommonsmenuitem.name,
      station: ucsbdiningcommonsmenuitem.station,
    },
  });

  const onSuccess = (ucsbdiningcommonsmenuitem) => {
    toast(
      `New UCSBDiningCommonsMenuItem Created - id: ${ucsbdiningcommonsmenuitem.id} name: ${ucsbdiningcommonsmenuitem.name}`,
    );
  };

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, [
    "/api/UCSBDiningCommonsMenuItem/all",
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommonsMenuItem</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
