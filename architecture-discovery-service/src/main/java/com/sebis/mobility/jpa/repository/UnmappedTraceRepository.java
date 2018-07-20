package com.sebis.mobility.jpa.repository;

import com.sebis.mobility.jpa.domain.UnmappedTrace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnmappedTraceRepository extends JpaRepository<UnmappedTrace, Long> {
}