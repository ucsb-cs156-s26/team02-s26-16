import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("react-toastify", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: vi.fn(),
  };
});

const mockedNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: (props) => {
      mockedNavigate(props);
      return null;
    },
  };
});

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

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

  test("renders without crashing", async () => {
    setupAdminUser();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Create New UCSBDiningCommonsMenuItem"),
    ).toBeInTheDocument();
  });

  test("on submit, makes request to backend and redirects", async () => {
    setupAdminUser();

    axiosMock.onPost("/api/UCSBDiningCommonsMenuItem/post").reply(202, {
      id: 17,
      diningCommonsCode: "dlg",
      name: "Chicken Bowl",
      station: "Entrees",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Create New UCSBDiningCommonsMenuItem");

    const diningCommonsCodeInput = screen.getByLabelText("Dining Commons Code");
    const nameInput = screen.getByLabelText("Name");
    const stationInput = screen.getByLabelText("Station");

    fireEvent.change(diningCommonsCodeInput, { target: { value: "dlg" } });
    fireEvent.change(nameInput, { target: { value: "Chicken Bowl" } });
    fireEvent.change(stationInput, { target: { value: "Entrees" } });

    const submitButton = screen.getByText("Create");
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "dlg",
      name: "Chicken Bowl",
      station: "Entrees",
    });

    expect(toast).toHaveBeenCalledWith(
      "New UCSBDiningCommonsMenuItem Created - id: 17 name: Chicken Bowl",
    );

    expect(mockedNavigate).toHaveBeenCalledWith({
      to: "/diningcommonsmenuitem",
    });
  });
});
