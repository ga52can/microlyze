package com.sebis.mobility.controller.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sebis.mobility.jpa.domain.Revision;
import com.sebis.mobility.jpa.domain.annotation.Annotation;
import com.sebis.mobility.service.RevisionService;
import com.wordnik.swagger.annotations.Api;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ad/revision")
@Api(value = "architecture-discovery-api-v1", description = "Architecture Discovery Api v1endpoints")
public class RevisionController {

    @Autowired
    private RevisionService revisionService;

    @RequestMapping(method = RequestMethod.GET)
    public List<Revision> getRevisions(@RequestParam(value = "snapshot", required = false) Long snapshot) throws JsonProcessingException {
        return (snapshot == null) ? new ArrayList<>(revisionService.getCurrentRevisionsByComponentId().values()) : revisionService.getRevisionsByDate(new Date(snapshot));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET )
    public Revision getRevision(@PathVariable Long id) throws JsonProcessingException, NotFoundException {
        Revision revision = revisionService.findById(id);
        if(revision == null)
            throw new NotFoundException("Revision not found!");
        return revision;
    }

    @RequestMapping(value = "/{id}/annotation", method = RequestMethod.POST )
    public Revision createAnnotation(@PathVariable Long id, @RequestBody Annotation annotation) throws JsonProcessingException, NotFoundException {
        Revision revision = getRevision(id);
        revision.setAnnotation(annotation.getName(), annotation.getValue());
        return revisionService.saveRevision(revision);
    }

    @RequestMapping(value = "/{id}/annotations", method = RequestMethod.POST )
    public Revision createAnnotations(@PathVariable Long id, @RequestBody List<Annotation> annotations) throws JsonProcessingException, NotFoundException {
        Revision revision = getRevision(id);
        for(Annotation annotation : annotations)
            revision.setAnnotation(annotation.getName(), annotation.getValue());
        return revisionService.saveRevision(revision);
    }
}
