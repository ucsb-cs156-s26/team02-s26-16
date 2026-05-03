import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

const queryClient = new QueryClient();

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={["/diningcommonsmenuitem/edit/1"]}>
      <UCSBDiningCommonsMenuItemEditPage />
    </MemoryRouter>
  </QueryClientProvider>
);

export const Default = Template.bind({});
