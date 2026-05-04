import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function HelpRequestsForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "HelpRequestsForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="requester_email">Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requester_email"}
          id="requester_email"
          type="text"
          isInvalid={Boolean(errors.requester_email)}
          {...register("requester_email", {
            required: "Email is required.",
            maxLength: {
              value: 30,
              message: "Max length 30 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requester_email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="team_id">Team ID</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-team_id"}
          id="team_id"
          type="text"
          isInvalid={Boolean(errors.team_id)}
          {...register("team_id", {
            required: "Team ID is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.team_id?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="table_or_breakout_room">
          Table or Breakout Room
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-table_or_breakout_room"}
          id="table_or_breakout_room"
          type="text"
          isInvalid={Boolean(errors.table_or_breakout_room)}
          {...register("table_or_breakout_room", {
            required: "Table or Breakout Room is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.table_or_breakout_room?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="request_time">Request Time</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-request_time"}
          id="request_time"
          type="text"
          isInvalid={Boolean(errors.request_time)}
          {...register("request_time", {
            required: "Request Time is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.table_or_breakout_room?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="solved">Solved</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-solved"}
          id="solved"
          type="text"
          isInvalid={Boolean(errors.solved)}
          {...register("solved", {
            required: "Solved is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.solved?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default HelpRequestsForm;
