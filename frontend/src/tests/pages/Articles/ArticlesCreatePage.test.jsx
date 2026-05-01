import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 3,
      title: "Using testing-playground with React Testing Library",
      url: "https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7",
      explanation: "Helpful when we get to front end development",
      email: "phtcon@ucsb.edu",
      dateAdded: "2022-04-20T00:00",
    };

    axiosMock.onPost("/api/Articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Using testing-playground with React Testing Library" },
    });
    fireEvent.change(screen.getByLabelText("URL"), {
      target: {
        value:
          "https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7",
      },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Helpful when we get to front end development" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "phtcon@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Date Added (iso format)"), {
      target: { value: "2022-04-20T00:00" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Using testing-playground with React Testing Library",
      url: "https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7",
      explanation: "Helpful when we get to front end development",
      email: "phtcon@ucsb.edu",
      dateAdded: "2022-04-20T00:00",
    });

    expect(mockToast).toBeCalledWith(
      "New article Created - id: 3 title: Using testing-playground with React Testing Library",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});
