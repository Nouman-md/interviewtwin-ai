package com.interviewtwin.repository;

import com.interviewtwin.entity.InterviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewTypeRepository extends JpaRepository<InterviewType, Long> {

    Optional<InterviewType> findByTypeName(String typeName);
}
