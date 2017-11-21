package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}