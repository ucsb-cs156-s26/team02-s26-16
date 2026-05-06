import { render, screen, waitFor } from "@testing-library/react";
import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("HelpRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders expected content for ordinary user", async () => {
    // arrange
    setupUserOnly();
    axiosMock.onGet("/api/helprequests/all").reply(200, helpRequestFixtures.threeRequests);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await waitFor(() => {
      expect(screen.getByText("Help Requests")).toBeInTheDocument();
    });

    expect(screen.getByText("Help Requests")).toBeInTheDocument();

    // Create button should not be visible for ordinary users
    expect(screen.queryByText("Create Help Request")).not.toBeInTheDocument();
  });

  test("Renders expected content for admin user", async () => {
    // arrange
    setupAdminUser();
    axiosMock.onGet("/api/helprequests/all").reply(200, helpRequestFixtures.threeRequests);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await waitFor(() => {
      expect(screen.getByText("Help Requests")).toBeInTheDocument();
    });

    expect(screen.getByText("Help Requests")).toBeInTheDocument();

    // Create button should be visible for admin users
    expect(screen.getByText("Create Help Request")).toBeInTheDocument();
  });
});
