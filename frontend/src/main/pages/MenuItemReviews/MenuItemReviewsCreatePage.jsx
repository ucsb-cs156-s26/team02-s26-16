import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewsCreatePage({ storybook = false }) {
  const objectToAxiosParams = (review) => ({
    url: "/api/MenuItemReview/post",
    method: "POST",
    params: {
      itemId: review.itemId,
      reviewerEmail: review.reviewerEmail,
      stars: review.stars,
      dateReviewed: review.dateReviewed,
      comments: review.comments,
    },
  });

  const onSuccess = (review) => {
    toast(`New review Created - id: ${review.id} itemId: ${review.itemId}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/MenuItemReview/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />;
  }

  return (
    <BasicLayout>
      <h2>Create New Menu Item Review</h2>
      <MenuItemReviewForm submitAction={onSubmit} buttonLabel="Create" />
    </BasicLayout>
  );
}
