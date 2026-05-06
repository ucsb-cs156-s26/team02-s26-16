import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { UCSBOrganizationFixtures } from "fixtures/UCSBOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Short Organization Translation",
    "Organization Name",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={UCSBOrganizationFixtures.pfc}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    const shortTranslationInput = screen.getByTestId(
      `${testId}-orgTranslationShort`,
    );
    const orgTranslationInput = screen.getByTestId(`${testId}-orgTranslation`);
    const inactiveInput = screen.getByTestId(`${testId}-inactive`);

    // Use waitFor to allow React Hook Form to populate the values
    await waitFor(() => {
      expect(orgCodeInput).toHaveValue(UCSBOrganizationFixtures.pfc.orgCode);
    });

    expect(shortTranslationInput).toHaveValue(
      UCSBOrganizationFixtures.pfc.orgTranslationShort,
    );
    expect(orgTranslationInput).toHaveValue(
      UCSBOrganizationFixtures.pfc.orgTranslation,
    );

    // Note: select values are strings, so true becomes "true"
    expect(inactiveInput).toHaveValue(
      String(UCSBOrganizationFixtures.pfc.inactive),
    );

    // expect(orgCodeInput).toBeDisabled();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Short Translation Organization is required./);
    expect(
      screen.getByText(/Organization Translation is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Inactive status is required./),
    ).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByTestId(
      `${testId}-orgTranslationShort`,
    );
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "a".repeat(300) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });

  test("calls submitAction when all fields are valid", async () => {
    const submitAction = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm submitAction={submitAction} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-orgCode`), {
      target: { value: "zbt" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), {
      target: { value: "ZBT" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslation`), {
      target: { value: "Zeta Beta Tau" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-inactive`), {
      target: { value: "false" },
    });

    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitAction).toHaveBeenCalled());

    // orgCode is omitted because it is 'disabled' in your JSX
    expect(submitAction).toHaveBeenCalledWith(
      expect.objectContaining({
        orgCode: "zbt",
        orgTranslationShort: "ZBT",
        orgTranslation: "Zeta Beta Tau",
        inactive: "false",
      }),
      expect.anything(),
    );
  });
});
