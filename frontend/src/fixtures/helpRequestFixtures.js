const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "test@example.com",
    teamId: "test-team",
    tableOrBreakoutRoom: "Table 1",
    requestTime: "2022-01-02T12:00:00",
    explanation: "Test explanation",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "test1@example.com",
      teamId: "test-team-1",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Test explanation 1",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "test2@example.com",
      teamId: "test-team-2",
      tableOrBreakoutRoom: "Table 2",
      requestTime: "2022-04-03T12:00:00",
      explanation: "Test explanation 2",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "test3@example.com",
      teamId: "test-team-3",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2022-07-04T12:00:00",
      explanation: "Test explanation 3",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
