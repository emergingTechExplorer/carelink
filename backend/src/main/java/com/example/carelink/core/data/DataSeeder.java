package com.example.carelink.core.data;

import com.example.carelink.core.model.Babysitter;
import com.example.carelink.core.model.Review;
import com.example.carelink.core.model.User;
import com.example.carelink.core.repository.BabysitterDao;
import com.example.carelink.core.repository.ReviewRepository;
import com.example.carelink.core.repository.UserRepository;
import com.example.carelink.core.type.Role;
import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final BabysitterDao babysitterDao;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            if (userRepository.count() > 0) return;

            // ----------- Create 5 Babysitters -----------
            for (int i = 1; i <= 5; i++) {
                User babysitterUser = new User();
                babysitterUser.setFirstName("Sitter" + i);
                babysitterUser.setLastName("Care");
                babysitterUser.setEmail("sitter" + i + "@example.com");
                babysitterUser.setPassword(passwordEncoder.encode("Test@123"));
                babysitterUser.setRole(Role.BABYSITTER);
                userRepository.save(babysitterUser);

                Babysitter sitter = new Babysitter();
                sitter.setUser(babysitterUser);
                sitter.setPhone("111-111-100" + i);
                sitter.setAddress("100" + i + " Maple Street");
                sitter.setQualifications("Certified in Childcare, CPR");
                sitter.setExperienceInYears(2 + i);
                sitter.setHourlyRate(12.0 + i);
                sitter.setAvailabilityDays(List.of(WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY));
                sitter.setAvailabilityTimeRange(TimeSlot.FULL_DAY);
                sitter.setBio("Experienced babysitter " + i + " who loves kids.");
                sitter.setLicenseNumber("LIC100" + i);
                sitter.setProfileImageUrl("https://via.placeholder.com/150");
                sitter.setLocation("Cityville");
                sitter.setAge(35);

                babysitterDao.save(sitter);
            }

            // ----------- Create 5 Parents -----------
            for (int i = 1; i <= 5; i++) {
                User parent = new User();
                parent.setFirstName("Parent" + i);
                parent.setLastName("Smith");
                parent.setEmail("parent" + i + "@example.com");
                parent.setPassword(passwordEncoder.encode("Test@123"));
                parent.setRole(Role.PARENT);
                userRepository.save(parent);
            }

            // ----------- Add Reviews from Parents to Babysitters -----------
            List<User> parents = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.PARENT)
                    .toList();

            List<Babysitter> sitters = babysitterDao.findAll();

            for (int i = 0; i < parents.size(); i++) {
                Review review = new Review();
                review.setParent(parents.get(i));
                review.setBabysitter(sitters.get(i % sitters.size()));
                review.setRating(4 + (i % 2));
                review.setComment("Excellent service from babysitter " + (i + 1));
                review.setReviewDate(LocalDate.now().minusDays(i));
                reviewRepository.save(review);
            }

            System.out.println("Seeded 5 babysitters, 5 parents, and 5 reviews.");
        };
    }
}
