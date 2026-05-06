import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
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

describe("MenuItemReviewsCreatePage tests", () => {
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
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const review = {
      id: 2,
      itemId: 12,
      reviewerEmail: "johns@ucsb.edu",
      stars: 3,
      dateReviewed: "2026-04-30T05:29",
      comments: "I really really like pie",
    };

    axiosMock.onPost("/api/MenuItemReview/post").reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("Item ID");
    expect(itemIdInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Reviewer Email");
    expect(emailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const dateInput = screen.getByLabelText("Date Reviewed (iso format)");
    expect(dateInput).toBeInTheDocument();

    const commentInput = screen.getByLabelText("Comments");
    expect(commentInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: "12" } });
    fireEvent.change(emailInput, { target: { value: "johns@ucsb.edu" } });
    fireEvent.change(starsInput, { target: { value: "3" } });
    fireEvent.change(dateInput, { target: { value: "2026-04-30T05:29" } });
    fireEvent.change(commentInput, {
      target: { value: "I really really like pie" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "12",
      reviewerEmail: "johns@ucsb.edu",
      stars: "3",
      dateReviewed: "2026-04-30T05:29",
      comments: "I really really like pie",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New review Created - id: 2 itemId: 12",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });
  });
});
