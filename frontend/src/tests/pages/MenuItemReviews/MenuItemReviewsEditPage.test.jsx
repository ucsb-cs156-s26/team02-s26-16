import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

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
describe("MenuItemReviewsEditPage tests", () => {
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
      axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).timeout();
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
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Review");
      expect(screen.queryByTestId("Review-itemId")).not.toBeInTheDocument();
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
        .onGet("/api/MenuItemReview", { params: { id: 17 } })
        .reply(200, {
          id: "17",
          itemId: "16",
          reviewerEmail: "johns@ucsb.edu",
          stars: "4",
          dateReviewed: "2026-04-30T05:29",
          comments: "I love pie",
        });
      axiosMock.onPut("/api/MenuItemReview").reply(200, {
        id: "17",
        itemId: "18",
        reviewerEmail: "johnny@ucsb.edu",
        stars: "3",
        dateReviewed: "2026-04-30T05:30",
        comments: "I like pizza",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("16");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("johns@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("4");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2026-04-30T05:29");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("I love pie");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "18" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "johnny@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "3" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2026-04-30T05:30" },
      });
      fireEvent.change(commentsField, {
        target: { value: "I like pizza" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Review Updated - id: 17 itemId: 18",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: "17" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "18",
          reviewerEmail: "johnny@ucsb.edu",
          stars: "3",
          dateReviewed: "2026-04-30T05:30",
          comments: "I like pizza",
        }),
      ); // posted object
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
  });
});
