import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const noop = () => {};

function UCSBOrganizationForm({
  initialContents,
  submitAction = noop,
  buttonLabel = "Create",
}) {
  const navigate = useNavigate();
  const testIdPrefix = "UCSBOrganizationForm";

  // Build defaultValues without conditional object literals that Stryker mutates easily
  const defaultValues = {
    ...(initialContents ?? {}),
    inactive:
      initialContents?.inactive === undefined
        ? ""
        : String(initialContents.inactive),
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Form.Group className="mb-3" controlId="orgTranslationShort">
        <Form.Label>Short Organization Translation</Form.Label>
        <Form.Control
          data-testid="UCSBOrganizationForm-orgTranslationShort"
          {...register("orgTranslationShort", {
            required: "Short Translation Organization is required.",
            maxLength: { value: 255, message: "Max length 255 characters" },
          })}
        />
        {errors.orgTranslationShort?.message && (
          <div className="text-danger">
            {errors.orgTranslationShort.message}
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="orgCode">
        <Form.Label>OrgCode</Form.Label>
        <Form.Control
          data-testid="UCSBOrganizationForm-orgCode"
          {...register("orgCode", {
            required: "OrgCode is required.",
            maxLength: { value: 255, message: "Max length 255 characters" },
          })}
        />
        {errors.orgCode?.message && (
          <div className="text-danger">{errors.orgCode.message}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="orgTranslation">
        <Form.Label>Organization Name</Form.Label>
        <Form.Control
          data-testid="UCSBOrganizationForm-orgTranslation"
          {...register("orgTranslation", {
            required: "Organization Translation is required.",
          })}
        />
        {errors.orgTranslation?.message && (
          <div className="text-danger">{errors.orgTranslation.message}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="inactive">
        <Form.Label>Inactive</Form.Label>
        <Form.Select
          data-testid="UCSBOrganizationForm-inactive"
          {...register("inactive", {
            setValueAs: (v) => (v === "" ? undefined : v === "true"),
            validate: (v) =>
              v === true || v === false || "Inactive status is required.",
          })}
        >
          <option value="">-- Select --</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </Form.Select>
        {errors.inactive?.message && (
          <div className="text-danger">{errors.inactive.message}</div>
        )}
      </Form.Group>

      <Button
        type="submit"
        data-testid={`${testIdPrefix}-submit`}
        className="me-2"
      >
        {buttonLabel}
      </Button>

      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        data-testid={`${testIdPrefix}-cancel`}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBOrganizationForm;
