import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({ storybook = false }) {
  const objectToAxiosParams = (UCSBOrganization) => ({
    url: "/api/UCSBOrganization/post",
    method: "POST",
    params: {
      orgCode: UCSBOrganization.orgCode,
      orgTranslationShort: UCSBOrganization.orgTranslationShort,
      orgTranslation: UCSBOrganization.orgTranslation,
      inactive:
        UCSBOrganization.inactive === "true" ||
        UCSBOrganization.inactive === true,
    },
  });

  const onSuccess = (UCSBOrganization) => {
    toast(
      `New UCSBOrganization Created - orgCode: ${UCSBOrganization.orgCode} orgTranslation: ${UCSBOrganization.orgTranslation}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBOrganization/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBOrganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
