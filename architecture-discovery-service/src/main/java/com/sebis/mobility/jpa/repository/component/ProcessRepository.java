package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Process;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessRepository extends JpaRepository<Process, Long> {
}