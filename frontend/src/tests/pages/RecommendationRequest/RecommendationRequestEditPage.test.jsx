import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";
import { expect, vi } from "vitest";

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
    useParams: vi.fn(() => ({
      id: 2,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestEditPage tests", () => {
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
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 2 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
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
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 2 } })
        .reply(200, recommendationRequestFixtures.oneRecommendationRequest);
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 2,
        requesterEmail: "iholiday@ucsb.edu",
        professorEmail: "pconrad@ucsb.edu",
        explanation: "Updated explanation for application",
        dateRequested: "2026-04-30T15:28",
        dateNeeded: "2026-05-01T23:59",
        done: false,
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
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("2");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("iholiday@ucsb.edu");
      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("pconrad@ucsb.edu");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "Need letter for BS/MS application.",
      );

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "newemail@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Updated explanation for application" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Recommendation Request Updated - id: 2",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toHaveValue("2");
      expect(requesterEmailField).toHaveValue("iholiday@ucsb.edu");
      expect(professorEmailField).toHaveValue("pconrad@ucsb.edu");
      expect(explanationField).toHaveValue(
        "Need letter for BS/MS application.",
      );
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "newemail@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Updated explanation for application" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Recommendation Request Updated - id: 2",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
    });
  });
});
