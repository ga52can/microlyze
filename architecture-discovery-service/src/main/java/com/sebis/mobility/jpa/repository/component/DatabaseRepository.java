package com.sebis.mobility.jpa.repository.component;

import com.sebis.mobility.jpa.domain.component.Database;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DatabaseRepository extends JpaRepository<Database, Long> {
    public List<Database> findAll();
    public Database findByName(String name);
}