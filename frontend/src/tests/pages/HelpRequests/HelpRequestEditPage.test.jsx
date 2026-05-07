import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("HelpRequestsEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
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
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequestsForm-id"),
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "test@example.com",
        teamId: "test-team",
        tableOrBreakoutRoom: "Table 1",
        requestTime: "2022-01-02T12:00",
        explanation: "Test explanation",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: "17",
        requesterEmail: "test@example.com",
        teamId: "test-team",
        tableOrBreakoutRoom: "Table 1",
        requestTime: "2022-01-02T12:00",
        explanation: "Test explanation",
        solved: false,
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
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestsForm-id");

      const idField = screen.getByTestId("HelpRequestsForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestsForm-requester_email",
      );
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText(
        "Table or Breakout Room",
      );
      const requestTimeField = screen.getByLabelText("Request Time (in UTC)");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("test@example.com");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("test-team");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("Table 1");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2022-01-02T12:00");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Test explanation");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "test@example.com" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "test-team" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "Table 1" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2022-01-02T12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Test explanation" },
      });
      fireEvent.change(solvedField, {
        target: { value: false },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: test@example.com",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "test@example.com",
          teamId: "test-team",
          tableOrBreakoutRoom: "Table 1",
          requestTime: "2022-01-02T12:00",
          explanation: "Test explanation",
          solved: false,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestsForm-id");

      const idField = screen.getByTestId("HelpRequestsForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestsForm-requester_email",
      );
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText(
        "Table or Breakout Room",
      );
      const requestTimeField = screen.getByLabelText("Request Time (in UTC)");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("test@example.com");
      expect(teamIdField).toHaveValue("test-team");
      expect(tableOrBreakoutRoomField).toHaveValue("Table 1");
      expect(requestTimeField).toHaveValue("2022-01-02T12:00");
      expect(explanationField).toHaveValue("Test explanation");
      expect(solvedField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "test@example.com" },
      });
      fireEvent.change(teamIdField, { target: { value: "test-team" } });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "Table 1" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2022-01-02T12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Test explanation" },
      });
      fireEvent.change(solvedField, { target: { value: false } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: test@example.com",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
    });
  });
});
