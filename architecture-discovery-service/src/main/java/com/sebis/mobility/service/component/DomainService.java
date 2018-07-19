package com.sebis.mobility.service.component;

import com.sebis.mobility.jpa.domain.component.Domain;
import com.sebis.mobility.jpa.repository.component.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DomainService extends ComponentBaseService<Domain> {

    @Autowired
    private DomainRepository domainRepository;

    @PostConstruct
    private void initialize() {
        super.initialize(domainRepository);
    }

    public Domain createDomain(String domainName) {
        return super.createComponent(new Domain(), domainName);
    }

    public Domain saveDomain(Domain domain) {
        return super.saveComponent(domain);
    }
}
