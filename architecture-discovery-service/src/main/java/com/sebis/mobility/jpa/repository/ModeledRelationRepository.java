package com.sebis.mobility.jpa.repository;

import com.sebis.mobility.jpa.domain.ModeledRelation;
import com.sebis.mobility.jpa.domain.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ModeledRelationRepository extends JpaRepository<ModeledRelation, Long> {

    @Query("SELECT s FROM ModeledRelation s where validFrom >= ?1 and validTo <= ?1")
    public List<Revision> findModeledRelations(Date date);

    @Query("SELECT s FROM ModeledRelation  s where validTo is null")
    public List<Revision> findCurrentModeledRelations();
}