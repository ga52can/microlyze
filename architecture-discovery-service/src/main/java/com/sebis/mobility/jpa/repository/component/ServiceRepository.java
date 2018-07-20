package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    public List<Service> findAll();
    public Service findByName (String name);
}