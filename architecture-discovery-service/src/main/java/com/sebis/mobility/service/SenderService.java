package com.sebis.mobility.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sebis.mobility.service.dto.SpanDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void sendSpanInfo(List<SpanDTO> spans) {
        ObjectMapper mapper = new ObjectMapper();
        String json;
        try {
            json = mapper.writeValueAsString(spans);
        } catch (JsonProcessingException e) {
            LOGGER.error("Failed to serialize the span list", e);
            return;
        }
        LOGGER.info("sending payload='{}' to topic='{}'", json, topic);
        kafkaTemplate.send(topic, json);
    }
}
