const menuItemReviewFixtures = {
  oneReview: {
    id: 2,
    itemId: 12,
    reviewerEmail: "johns@ucsb.edu",
    stars: 3,
    dateReviewed: "2026-04-30T05:29:22",
    comments: "I really really like pie",
  },
  threeReviews: [
    {
      id: 2,
      itemId: 12,
      reviewerEmail: "johns@ucsb.edu",
      stars: 3,
      dateReviewed: "2026-04-30T05:29:22",
      comments: "I really really like pie",
    },
    {
      id: 3,
      itemId: 15,
      reviewerEmail: "hater@ucsb.edu",
      stars: 1,
      dateReviewed: "2026-04-30T05:38:22",
      comments: "This tastes like cardboard",
    },
    {
      id: 4,
      itemId: 25,
      reviewerEmail: "lasttest@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-04-30T05:39:22",
      comments: "Carillo on top",
    },
  ],
};

export { menuItemReviewFixtures };
