package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Hardware;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HardwareRepository extends JpaRepository<Hardware, Long> {
    public List<Hardware> findAll();
    public Hardware findByName(String name);
}