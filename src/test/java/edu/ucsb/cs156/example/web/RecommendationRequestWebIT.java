package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
    setupUser(true);

    page.getByText("RecommendationRequest").click();

    page.getByText("Create Recommendation Request").click();
    assertThat(page.getByText("Create New Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-requesterEmail").fill("iholiday@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-professorEmail").fill("pconrad@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-explanation").fill("Need BS/MS letter of rec");
    page.getByTestId("RecommendationRequestForm-dateRequested").fill("2025-04-15T00:00");
    page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2026-12-03T00:00");
    page.getByTestId("RecommendationRequestForm-done").uncheck();

    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("iholiday@ucsb.edu");

    // PASSED ABOVE THIS
    // add tests for edit
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button"))
        .isVisible();
    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-done").check();
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-done")).hasText("false");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendation_request() throws Exception {
    setupUser(false);
    page.getByText("RecommendationRequest").click();
    assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }
}
