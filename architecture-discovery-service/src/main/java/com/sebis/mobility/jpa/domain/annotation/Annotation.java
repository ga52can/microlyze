package com.sebis.mobility.jpa.domain.annotation;

import com.fasterxml.jackson.annotation.JsonValue;
import com.sebis.mobility.jpa.domain.AbstractPersistable;

import javax.persistence.Lob;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class Annotation extends AbstractPersistable {

    private String name;
    @Lob
    private byte[] value;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonValue
    public String getValue() {
        return new String(value);
    }

    public void setValue(String value) {
        this.value = value.getBytes();
    }
}
