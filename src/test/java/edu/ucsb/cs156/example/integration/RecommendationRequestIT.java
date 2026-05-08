package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange
    RecommendationRequest recommendationRequest =
        RecommendationRequest.builder()
            .requesterEmail("student@ucsb.edu")
            .professorEmail("prof@ucsb.edu")
            .explanation("Graduate school application")
            .dateRequested(LocalDateTime.now())
            .dateNeeded(LocalDateTime.now().plusDays(7))
            .done(false)
            .build();

    recommendationRequestRepository.save(recommendationRequest);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequests?id=1"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    RecommendationRequest result =
        mapper.readValue(response.getResponse().getContentAsString(), RecommendationRequest.class);
    assertEquals("student@ucsb.edu", result.getRequesterEmail());
    assertEquals("prof@ucsb.edu", result.getProfessorEmail());
    assertEquals("Graduate school application", result.getExplanation());
    assertEquals(false, result.getDone());
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_recommendation_request() throws Exception {
    // arrange
    LocalDateTime dateRequested = LocalDateTime.now();
    LocalDateTime dateNeeded = LocalDateTime.now().plusDays(7);

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/recommendationrequests/post?requesterEmail=student@ucsb.edu&professorEmail=prof@ucsb.edu&explanation=Graduate school application&dateRequested="
                        + dateRequested
                        + "&dateNeeded="
                        + dateNeeded)
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    RecommendationRequest result =
        mapper.readValue(response.getResponse().getContentAsString(), RecommendationRequest.class);
    assertEquals("student@ucsb.edu", result.getRequesterEmail());
    assertEquals("prof@ucsb.edu", result.getProfessorEmail());
    assertEquals("Graduate school application", result.getExplanation());
    assertEquals(false, result.getDone());
  }
}
