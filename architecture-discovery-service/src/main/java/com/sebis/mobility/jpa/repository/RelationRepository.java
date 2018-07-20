package com.sebis.mobility.jpa.repository;

import com.sebis.mobility.jpa.domain.Relation;
import com.sebis.mobility.jpa.domain.Revision;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelationRepository extends JpaRepository<Relation, Long> {
    public Relation findByOwnerAndCallerAndCallee(Revision owner, Revision caller, Revision callee);
}