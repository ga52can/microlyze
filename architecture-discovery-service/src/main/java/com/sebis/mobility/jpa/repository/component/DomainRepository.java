package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DomainRepository extends JpaRepository<Domain, Long> {
    public List<Domain> findAll();
    public Domain findByName(String name);
}