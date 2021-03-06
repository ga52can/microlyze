package com.sebis.mobility.controller.api.model;

import com.sebis.mobility.jpa.domain.Revision;
import com.sebis.mobility.jpa.domain.component.Component;

public class ComponentRevisionPair {
    private Component component;
    private Revision revision;

    public ComponentRevisionPair(Component component, Revision revision) {
        this.component = component;
        this.revision = revision;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }

    public Revision getRevision() {
        return revision;
    }

    public void setRevision(Revision revision) {
        this.revision = revision;
    }
}
