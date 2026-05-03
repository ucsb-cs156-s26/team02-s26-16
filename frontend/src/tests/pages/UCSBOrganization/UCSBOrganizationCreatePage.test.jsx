import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /UCSBOrganization", async () => {
    const queryClient = new QueryClient();
    const USCBOrganization = {
      orgCode: "vsa",
      orgTranslationShort: "VSA",
      orgTranslation: "Vietamese Student Assocation",
      inactive: false,
    };

    axiosMock.onPost("/api/UCSBOrganization/post").reply(202, USCBOrganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByLabelText("OrgCode");
    expect(orgCodeInput).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByLabelText(
      "Short Organization Translation",
    );
    expect(orgTranslationShortInput).toBeInTheDocument();

    const orgTranslationInput = screen.getByLabelText("Organization Name");
    expect(orgTranslationInput).toBeInTheDocument();

    const inactiveInput = screen.getByLabelText("Inactive");
    expect(inactiveInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(orgCodeInput, { target: { value: "vsa" } });
    fireEvent.change(orgTranslationShortInput, { target: { value: "VSA" } });
    fireEvent.change(orgTranslationInput, {
      target: { value: "Vietamese Student Assocation" },
    });
    fireEvent.change(inactiveInput, { target: { value: false } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "vsa",
      orgTranslationShort: "VSA",
      orgTranslation: "Vietamese Student Assocation",
      inactive: false,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New UCSBOrganization Created - orgCode: vsa orgTranslation: Vietamese Student Assocation",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/UCSBOrganization" });
  });

  test("on submit, when inactive is 'true' string, sends inactive=true to backend", async () => {
    const queryClient = new QueryClient();

    const UCSBOrganization = {
      orgCode: "acm",
      orgTranslationShort: "ACM",
      orgTranslation: "Association for Computing Machinery",
      inactive: true,
    };

    axiosMock.onPost("/api/UCSBOrganization/post").reply(202, UCSBOrganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("OrgCode"), {
      target: { value: "acm" },
    });

    fireEvent.change(screen.getByLabelText("Short Organization Translation"), {
      target: { value: "ACM" },
    });

    fireEvent.change(screen.getByLabelText("Organization Name"), {
      target: { value: "Association for Computing Machinery" },
    });

    // 🔴 This line kills the mutation
    fireEvent.change(screen.getByLabelText("Inactive"), {
      target: { value: "true" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "acm",
      orgTranslationShort: "ACM",
      orgTranslation: "Association for Computing Machinery",
      inactive: true,
    });
  });

  test("on submit, when inactive is 'false', sends inactive=false to backend", async () => {
    const queryClient = new QueryClient();

    axiosMock.onPost("/api/UCSBOrganization/post").reply(202, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("OrgCode"), {
      target: { value: "test" },
    });

    fireEvent.change(screen.getByLabelText("Short Organization Translation"), {
      target: { value: "TEST" },
    });

    fireEvent.change(screen.getByLabelText("Organization Name"), {
      target: { value: "Test Org" },
    });

    fireEvent.change(screen.getByLabelText("Inactive"), {
      target: { value: "false" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params.inactive).toBe(false);
  });
});
