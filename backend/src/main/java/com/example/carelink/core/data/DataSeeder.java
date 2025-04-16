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
            String[] names = {"Alice", "Bob", "Cathy", "David", "Ella"};
            String[] cities = {"Toronto", "Vancouver"};
            String[] lastNames = {"Anderson", "Brown", "Clark", "Davis", "Evans"};
            for (int i = 0; i < 5; i++) {
                String name = names[i];
                String city = cities[i % cities.length];
                int suffix = (int)(Math.random() * 1000);

                User babysitterUser = new User();
                babysitterUser.setFirstName(name);
                babysitterUser.setLastName(lastNames[i]);
                babysitterUser.setEmail(name.toLowerCase() + suffix + "@example.com");
                babysitterUser.setPassword(passwordEncoder.encode("Test@123"));
                babysitterUser.setRole(Role.BABYSITTER);
                userRepository.save(babysitterUser);

                Babysitter sitter = new Babysitter();
                sitter.setUser(babysitterUser);
                sitter.setPhone("111-111-" + (1000 + suffix));
                sitter.setAddress((100 + suffix) + " Oak Street");
                sitter.setQualifications("Certified in Childcare, CPR");
                sitter.setExperienceInYears(1 + (int)(Math.random() * 5));
                sitter.setHourlyRate((double) Math.round(10.0 + Math.random() * 10));
                sitter.setAvailabilityDays(List.of(WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY));
                sitter.setAvailabilityTimeRange(TimeSlot.FULL_DAY);
                sitter.setBio("Experienced babysitter " + name + " who loves kids.");
                sitter.setLicenseNumber("LIC" + (1000 + suffix));
                String[] imageUrls = {
                        "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=3479&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=3750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                };
                sitter.setProfileImageUrl(imageUrls[i]);
                sitter.setLocation(city);
                sitter.setAge(25 + (int)(Math.random() * 10));

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
