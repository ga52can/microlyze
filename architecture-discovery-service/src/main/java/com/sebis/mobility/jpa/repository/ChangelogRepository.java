package com.sebis.mobility.jpa.repository;

import com.sebis.mobility.jpa.domain.Changelog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChangelogRepository extends JpaRepository<Changelog, Long> {
}