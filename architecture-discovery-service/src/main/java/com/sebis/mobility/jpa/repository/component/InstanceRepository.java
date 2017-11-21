package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Instance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstanceRepository extends JpaRepository<Instance, Long> {
    public List<Instance> findAll();
    public Instance findByName (String name);
}