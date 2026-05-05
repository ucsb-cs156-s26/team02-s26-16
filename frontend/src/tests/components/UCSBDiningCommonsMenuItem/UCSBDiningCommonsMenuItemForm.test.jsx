import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router";
import { vi } from "vitest";

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    expect(await screen.findByText(/Dining Commons Code/)).toBeInTheDocument();
    expect(await screen.findByText(/Name/)).toBeInTheDocument();
    expect(await screen.findByText(/Station/)).toBeInTheDocument();
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"),
    ).toBeInTheDocument();
  });

  test("renders correctly with initialContents", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={ucsbDiningCommonsMenuItemFixtures.oneMenuItem}
        />
      </Router>,
    );

    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-id")).toHaveValue(
      "1",
    );
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
    ).toHaveValue("dlg");
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-name"),
    ).toHaveValue("Chicken Teriyaki Bowl");
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-station"),
    ).toHaveValue("Entree");
  });

  test("correct error messages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    fireEvent.click(screen.getByText("Create"));

    expect(
      await screen.findByText(/Dining Commons Code is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("no error messages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );

    fireEvent.change(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
      {
        target: { value: "dlg" },
      },
    );
    fireEvent.change(screen.getByTestId("UCSBDiningCommonsMenuItemForm-name"), {
      target: { value: "Chicken Teriyaki Bowl" },
    });
    fireEvent.change(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-station"),
      {
        target: { value: "Entree" },
      },
    );

    fireEvent.click(screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("cancel button navigates back", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    fireEvent.click(screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel"));

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test("renders with custom button label", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm buttonLabel="Update" />
      </Router>,
    );

    expect(screen.getByText("Update")).toBeInTheDocument();
  });
});
