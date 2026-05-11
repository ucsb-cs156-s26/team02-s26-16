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
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_help_request() throws Exception {
    setupUser(true);

    page.getByText("Help Requests").click();

    page.getByText("Create Help Request").click();
    assertThat(page.getByText("Create New Help Request")).isVisible();
    page.getByTestId("HelpRequestsForm-requester_email").fill("test@ucsb.edu");
    page.locator("#team_id").fill("team02");
    page.locator("#table_or_breakout_room").fill("table1");
    page.locator("#request_time").fill("2025-05-10T14:30");
    page.locator("#explanation").fill("Need help with Spring Boot");
    page.locator("button[type='submit']").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("test@ucsb.edu");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("team02");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("Need help with Spring Boot");
  }

  @Test
  public void regular_user_cannot_create_help_request() throws Exception {
    setupUser(false);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create Help Request")).not().isVisible();
  }
}
