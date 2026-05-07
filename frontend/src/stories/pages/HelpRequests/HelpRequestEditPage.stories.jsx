import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

export default {
  title: "pages/HelpRequests/HelpRequestEditPage",
  component: HelpRequestEditPage,
};

const Template = () => <HelpRequestEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/helprequests", () => {
      return HttpResponse.json(
        {
          id: "1",
          requesterEmail: "test@test.edu",
          teamId: "test-team",
          tableOrBreakoutRoom: "Table 1",
          requestTime: "2022-01-02T12:00:00",
          explanation: "Test explanation",
          solved: false,
        },
        {
          status: 200,
        },
      );
    }),
    http.put("/api/helprequests", async ({ request }) => {
      const body = await request.text();
      const updatedData = JSON.parse(body);
      return HttpResponse.json({ ...updatedData, id: "1" }, { status: 200 });
    }),
  ],
};
