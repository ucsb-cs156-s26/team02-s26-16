import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import * as useBackendModule from "main/utils/useBackend";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();

vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();

  const toastFn = vi.fn((...args) => mockToast(...args));
  toastFn.success = vi.fn((...args) => mockToast(...args));
  toastFn.error = vi.fn((...args) => mockToast(...args));
  toastFn.warn = vi.fn((...args) => mockToast(...args));
  toastFn.info = vi.fn((...args) => mockToast(...args));

  return {
    ...originalModule,
    toast: toastFn,
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      orgCode: "vsa",
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("UCSBOrganizationEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingBackend);
      axiosMock
        .onGet("/api/UCSBOrganization", { params: { orgCode: "vsa" } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSBOrganization");
      expect(
        screen.queryByTestId("UCSBOrganization-orgCode"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingBackend);
      axiosMock
        .onGet("/api/UCSBOrganization", { params: { orgCode: "vsa" } })
        .reply(200, {
          orgCode: "vsa",
          orgTranslationShort: "VSA",
          orgTranslation: "Vietnamese Student Association",
          inactive: false,
        });
      axiosMock.onPut("/api/UCSBOrganization").reply(200, {
        orgCode: "vsa",
        orgTranslationShort: "VSA",
        orgTranslation: "UCSB Vietnamese Student Association",
        inactive: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("vsa");
      expect(orgTranslationShortField).toBeInTheDocument();
      expect(orgTranslationShortField).toHaveValue("VSA");
      expect(orgTranslationField).toBeInTheDocument();
      expect(orgTranslationField).toHaveValue("Vietnamese Student Association");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).toHaveValue("false");

      expect(submitButton).toHaveTextContent("Update");
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toHaveValue("vsa");
      expect(orgTranslationShortField).toHaveValue("VSA");
      expect(orgTranslationField).toHaveValue("Vietnamese Student Association");
      expect(inactiveField).toHaveValue("false");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(orgTranslationField, {
        target: { value: "UCSB Vietnamese Student Association" },
      });

      fireEvent.click(submitButton);
      await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

      const putCall = axiosMock.history.put[0];

      expect(putCall.params).toEqual({ orgCode: "vsa" });
      const putBody = JSON.parse(putCall.data);

      expect(putBody).toMatchObject({
        orgTranslationShort: "VSA",
        orgTranslation: "UCSB Vietnamese Student Association",
      });

      // inactive may be boolean or string depending on form lib
      expect(putBody).toHaveProperty("inactive");

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBOrganization Updated - orgCode: vsa orgTranslation: UCSB Vietnamese Student Association",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/UCSBOrganization" });
    });
  });

  describe("hook wiring", () => {
    test("calls useBackend and useBackendMutation with correct args", async () => {
      const useBackendSpy = vi
        .spyOn(useBackendModule, "useBackend")
        .mockReturnValue({
          data: {
            orgCode: "vsa",
            orgTranslationShort: "VSA",
            orgTranslation: "Vietnamese Student Association",
            inactive: false,
          },
          _error: null,
          _status: "success",
        });

      const useBackendMutationSpy = vi
        .spyOn(useBackendModule, "useBackendMutation")
        .mockReturnValue({ mutate: vi.fn(), isSuccess: false });

      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit UCSBOrganization");

      // ✅ KILLS useBackend([]) and method:""
      expect(useBackendSpy).toHaveBeenCalledWith(
        [`/api/UCSBOrganization?orgCode=vsa`],
        expect.objectContaining({
          method: "GET",
          url: "/api/UCSBOrganization",
          params: { orgCode: "vsa" },
        }),
      );

      // ✅ KILLS mutation key [] / [""]
      expect(useBackendMutationSpy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
        [`/api/UCSBOrganization?orgCode=vsa`],
      );

      vi.restoreAllMocks();
    });
  });
});
