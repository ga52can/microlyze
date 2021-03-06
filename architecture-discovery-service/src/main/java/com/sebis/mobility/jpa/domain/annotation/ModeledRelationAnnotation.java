package com.sebis.mobility.jpa.domain.annotation;

import com.sebis.mobility.jpa.domain.ModeledRelation;

import javax.persistence.*;


@Entity
@Table(name = "modeledrelation_annotations")
public class ModeledRelationAnnotation extends Annotation {
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="modeledrelation_id", nullable=false)
    private ModeledRelation modeledRelation = null;

    public ModeledRelation getModeledRelation() {
        return modeledRelation;
    }

    public void setModeledRelation(ModeledRelation modeledRelation) {
        this.modeledRelation = modeledRelation;
    }
}