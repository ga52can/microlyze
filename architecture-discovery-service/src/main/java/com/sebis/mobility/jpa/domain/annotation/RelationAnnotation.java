package com.sebis.mobility.jpa.domain.annotation;

import com.sebis.mobility.jpa.domain.Relation;

import javax.persistence.*;


@Entity
@Table(name = "relation_annotations")
public class RelationAnnotation extends Annotation {
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="relation_id", nullable=false)
    private Relation relation = null;

    public Relation getRelation() {
        return relation;
    }

    public void setRelation(Relation relation) {
        this.relation = relation;
    }
}