package com.sebis.mobility.service.dto.mapper;

import com.sebis.mobility.service.dto.SpanDTO;
import com.sebis.mobility.service.dto.SpanDTO.AnnotationDTO;
import zipkin.Span;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class SpanMapper {
    private SpanMapper() {
    }

    public static SpanDTO map(Span source) {
        if (source == null) {
            return null;
        }

        List<AnnotationDTO> annotations = new ArrayList<>();
        annotations.addAll(
                source.annotations
                        .stream()
                        .map(annotation -> new AnnotationDTO(annotation.value, null, annotation.timestamp))
                        .collect(Collectors.toList())
        );
        annotations.addAll(
                source.binaryAnnotations
                        .stream()
                        .map(annotation -> new AnnotationDTO(annotation.key, new String(annotation.value), null))
                        .collect(Collectors.toList())
        );

        SpanDTO dto = new SpanDTO();
        dto.setTraceIdHigh(source.traceIdHigh);
        dto.setTraceId(source.traceId);
        dto.setName(source.name);
        dto.setId(source.id);
        dto.setParentId(source.parentId);
        dto.setTimestamp(source.timestamp);
        dto.setDuration(source.duration);
        dto.setAnnotations(annotations);
        return dto;
    }
}
