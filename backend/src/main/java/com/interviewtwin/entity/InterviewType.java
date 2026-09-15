package com.interviewtwin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long typeId;

    @Column(unique = true, nullable = false)
    private String typeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "interviewType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<InterviewSession> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "interviewType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Question> questions = new ArrayList<>();
}
