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

  const expectedHeaders = [
    "orgCode",
    "ShortOrganizationTranslation",
    "OrganizationTranslation",
    "Inactive",
  ];
  const expectedFields = [
    "orgCode",
    "orgTranslationShort",
    "orgTranslation",
    "inactive",
  ];
  const testId = "UCSBOrganizationTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
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

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
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

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

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
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
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

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

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
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
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

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`),
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

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/UCSBOrganization/edit/vsa"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/UCSBOrganizations/vsa")
      .reply(200, { message: "UCSBOrganization deleted" });

    // act - render the component
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

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`),
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

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "vsa" });
  });
});
