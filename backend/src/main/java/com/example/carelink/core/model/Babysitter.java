package com.example.carelink.core.model;

import com.example.carelink.core.type.TimeSlot;
import com.example.carelink.core.type.WeekDay;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "babysitters")
@Getter
@Setter
public class Babysitter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String phone;
    private String address;
    private String qualifications;
    private Integer experienceInYears;
    private Double hourlyRate;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "babysitter_availability_days", joinColumns = @JoinColumn(name = "babysitter_id"))
    @Column(name = "available_day")
    private List<WeekDay> availabilityDays;

    @Enumerated(EnumType.STRING)
    private TimeSlot availabilityTimeRange;

    private String bio;
    private String licenseNumber;
    private String profileImageUrl;

    @OneToMany(mappedBy = "babysitter", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Review> reviews;

    private String location;

    private int age;
}
