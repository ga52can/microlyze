package com.sebis.mobility.service.component;

import com.sebis.mobility.jpa.domain.component.Instance;
import com.sebis.mobility.jpa.repository.component.InstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class InstanceService extends ComponentBaseService<Instance> {

    @Autowired
    private InstanceRepository instanceRepository;

    @PostConstruct
    private void initialize() {
        super.initialize(instanceRepository);
    }

    public Instance createInstance(String instanceName) {
        return super.createComponent(new Instance(), instanceName);
    }

    public Instance saveInstance(Instance instance) {
        return super.saveComponent(instance);
    }

}
