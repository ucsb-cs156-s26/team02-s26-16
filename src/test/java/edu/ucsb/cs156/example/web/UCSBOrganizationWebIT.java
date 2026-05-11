package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import com.microsoft.playwright.Page;
import edu.ucsb.cs156.example.WebTestCase;
import java.nio.file.Paths;
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
public class UCSBOrganizationWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_ucsborganization() throws Exception {
    setupUser(true);

    page.getByText("UCSB Organization").click();

    page.getByText("Create UCSBOrganization").click();
    assertThat(page.getByText("Create New UCSBOrganization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgCode").fill("vsa");
    page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("VSA");
    page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Vietnamese Student Association");
    page.getByTestId("UCSBOrganizationForm-inactive").selectOption("false");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .hasText("VSA");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit UCSBOrganization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("VSA UPDATED");
    page.getByTestId("UCSBOrganizationForm-inactive").selectOption("false");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("debug_table.png")));
    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .hasText("VSA UPDATED");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_organization() throws Exception {
    setupUser(true);

    page.getByText("UCSB Organization").click();

    assertThat(page.getByText("Create New UCSBOrganization")).not().isVisible();
    assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-orgCode")).not().isVisible();
  }
}
