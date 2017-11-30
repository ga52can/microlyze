package com.sebis.mobility.service.dto;

import java.util.List;

public class SpanDTO {
    private long traceIdHigh;
    private long traceId;
    private String name;
    private long id;
    private Long parentId;
    private Long timestamp;
    private Long duration;
    private List<AnnotationDTO> annotations;

    public long getTraceIdHigh() {
        return traceIdHigh;
    }

    public void setTraceIdHigh(long traceIdHigh) {
        this.traceIdHigh = traceIdHigh;
    }

    public long getTraceId() {
        return traceId;
    }

    public void setTraceId(long traceId) {
        this.traceId = traceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public List<AnnotationDTO> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<AnnotationDTO> annotations) {
        this.annotations = annotations;
    }

    public static class AnnotationDTO {
        private String key;
        private String value;
        private Long timestamp;

        public AnnotationDTO(String key, String value, Long timestamp) {
            this.key = key;
            this.value = value;
            this.timestamp = timestamp;
        }

        public AnnotationDTO() {
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}


