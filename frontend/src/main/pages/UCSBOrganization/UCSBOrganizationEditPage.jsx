import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();
  // console.log("UCSBOrganizationEditPage: orgCode: ", orgCode);
  const {
    data: UCSBOrganization,
    _error,
    _status,
  } = useBackend([`/api/UCSBOrganization?orgCode=${orgCode}`], {
    method: "GET",
    url: `/api/UCSBOrganization`,
    params: { orgCode },
  });

  const objectToAxiosPutParams = (data) => ({
    url: "/api/UCSBOrganization",
    method: "PUT",
    params: {
      orgCode: orgCode, // The 'orgCode' from the URL
    },
    data: {
      orgCode: data.orgCode,
      orgTranslationShort: data.orgTranslationShort,
      orgTranslation: data.orgTranslation,
      inactive: data.inactive,
    },
  });

  const onSuccess = (UCSBOrganization) => {
    toast(
      `UCSBOrganization Updated - orgCode: ${UCSBOrganization.orgCode} orgTranslation: ${UCSBOrganization.orgTranslation}`,
    );
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess }, [
    `/api/UCSBOrganization?orgCode=${orgCode}`,
  ]);

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
        <h1>Edit UCSBOrganization</h1>
        {UCSBOrganization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={UCSBOrganization}
          />
        )}
      </div>
    </BasicLayout>
  );
}
