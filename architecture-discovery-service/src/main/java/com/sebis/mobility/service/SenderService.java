package com.sebis.mobility.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SenderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SenderService.class);

    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public SenderService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Value("${kafka.topic.span-info}")
    private String topic;

    public void sendSpanInfo(String payload) {
        LOGGER.info("sending payload='{}' to topic='{}'", payload, topic);
        kafkaTemplate.send(topic, payload);
    }
}
