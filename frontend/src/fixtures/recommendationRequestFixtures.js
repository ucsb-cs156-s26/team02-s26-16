const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 2,
    requesterEmail: "iholiday@ucsb.edu",
    professorEmail: "pconrad@ucsb.edu",
    explanation: "Need letter for BS/MS application.",
    dateRequested: "2026-04-30T15:28",
    dateNeeded: "2026-05-01T23:59",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "iholiday@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "Need letter for BS/MS application.",
      dateRequested: "2026-04-30T15:28",
      dateNeeded: "2026-05-01T23:59",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "iholiday@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "PhD letter of recommendation needed!",
      dateRequested: "2026-04-30T15:28",
      dateNeeded: "2026-12-25T23:59",
      done: true,
    },
    {
      id: 4,
      requesterEmail: "ivyholiday27@gmail.com",
      professorEmail: "zmatni@ucsb.edu",
      explanation: "Research opportunity letter of recommendation",
      dateRequested: "2026-04-30T14:00",
      dateNeeded: "2026-06-05T15:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
