import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { UCSBOrganizationFixtures } from "fixtures/UCSBOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "UCSBOrganizationTable";

  test("renders empty table correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable
            UCSBOrganization={[]}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("orgCode")).toBeInTheDocument();
    expect(
      screen.getByText("ShortOrganizationTranslation"),
    ).toBeInTheDocument();
    expect(screen.getByText("OrganizationTranslation")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);

    // Removed queryByTestId checks — they can't be killed by Stryker because
    // queryByTestId("") also returns null, making .not.toBeInTheDocument() pass either way.
    // The row count above is sufficient to prove no data rows rendered.
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable
            UCSBOrganization={UCSBOrganizationFixtures.asianOrgs}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headers — explicit, no forEach
    expect(screen.getByText("orgCode")).toBeInTheDocument();
    expect(
      screen.getByText("ShortOrganizationTranslation"),
    ).toBeInTheDocument();
    expect(screen.getByText("OrganizationTranslation")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    // Fields present — explicit, no forEach
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`),
    ).toBeInTheDocument();

    // Row 0 content
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("vsa");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`),
    ).toHaveTextContent("VSA");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`),
    ).toHaveTextContent("Vietnamese Student Association");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`),
    ).toHaveTextContent("true");

    // Row 1 content
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`),
    ).toHaveTextContent("csu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`),
    ).toHaveTextContent("CSU");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`),
    ).toHaveTextContent("Chinese Student Union");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-inactive`),
    ).toHaveTextContent("true");

    // Row 2 content (inactive: false — different value kills mutations on "true")
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-orgCode`),
    ).toHaveTextContent("nsu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-inactive`),
    ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has the expected column headers, content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable
            UCSBOrganization={UCSBOrganizationFixtures.asianOrgs}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headers — explicit, no forEach
    expect(screen.getByText("orgCode")).toBeInTheDocument();
    expect(
      screen.getByText("ShortOrganizationTranslation"),
    ).toBeInTheDocument();
    expect(screen.getByText("OrganizationTranslation")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    // Fields present — explicit, no forEach
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("vsa");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`),
    ).toHaveTextContent("VSA");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`),
    ).toHaveTextContent("Vietnamese Student Association");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`),
    ).toHaveTextContent("true");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`),
    ).toHaveTextContent("csu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`),
    ).toHaveTextContent("CSU");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`),
    ).toHaveTextContent("Chinese Student Union");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-inactive`),
    ).toHaveTextContent("true");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable
            UCSBOrganization={UCSBOrganizationFixtures.asianOrgs}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("vsa");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    // Use toHaveBeenCalledWith directly — not inside waitFor arrow
    // This kills the ArrowFunction mutant on waitFor
    expect(mockedNavigate).toHaveBeenCalledWith("/UCSBOrganization/edit/vsa");
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onAny().reply(500);
    axiosMock
      .onDelete("/api/UCSBOrganization")
      .reply(200, { message: "UCSBOrganization deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable
            UCSBOrganization={UCSBOrganizationFixtures.asianOrgs}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("vsa");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    // waitFor with a real timeout dependency — if the URL is wrong, onAny returns 500
    // and the delete call errors, so history.delete stays empty and this times out
    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBeGreaterThan(0);
    });

    expect(axiosMock.history.delete.length).toBe(1);
    expect(axiosMock.history.delete[0].url).toBe("/api/UCSBOrganization");
    expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "vsa" });
  });
});
