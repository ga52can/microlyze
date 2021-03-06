package com.sebis.mobility;

import com.sebis.mobility.controller.RegistryController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.sleuth.zipkin.stream.EnableZipkinStreamServer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import static java.util.concurrent.TimeUnit.SECONDS;

@SpringBootApplication
@EnableJpaRepositories
@EnableZipkinStreamServer
public class ArchitectureDiscoveryService {

    private final static ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private static final Logger log = LoggerFactory.getLogger(ArchitectureDiscoveryService.class);

    public static void main(String[] args) {

        ConfigurableApplicationContext context = SpringApplication.run(ArchitectureDiscoveryService.class, args);
        scheduler.scheduleAtFixedRate(() -> {
            try {
                context.getBean(RegistryController.class).eurekaCall();
            } catch (Exception ex ) {
                //ex.printStackTrace();
                //log.error(ex.getMessage());
            }
        },00 , 2, SECONDS);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
