package com.sebis.mobility.controller.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sebis.mobility.ArchitectureDiscoveryService;
import com.sebis.mobility.controller.api.model.ModeledRelationPair;
import com.sebis.mobility.jpa.domain.ModeledRelation;
import com.sebis.mobility.jpa.domain.Relation;
import com.sebis.mobility.jpa.domain.Revision;
import com.sebis.mobility.jpa.domain.annotation.Annotation;
import com.sebis.mobility.service.ModeledRelationService;
import com.sebis.mobility.service.RelationService;
import com.sebis.mobility.service.RevisionService;
import com.wordnik.swagger.annotations.Api;
import javafx.scene.media.Media;
import javassist.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ad/relation")
@Api(value = "architecture-discovery-api-v1", description = "Architecture Discovery Api v1endpoints")
public class RelationController {

    @Autowired
    private RelationService relationService;

    @Autowired
    private RevisionService revisionService;

    private static final Logger log = LoggerFactory.getLogger(RelationController.class);

    @RequestMapping(value = "/{id}", method = RequestMethod.GET )
    public Relation getRelation(@PathVariable Long id) throws JsonProcessingException, NotFoundException {

        Relation relation = relationService.findById(id);
        if(relation == null )
            throw new NotFoundException("ModeledRelation not found");
        return relation;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Relation createRelation(@RequestBody ModeledRelationPair relationBody) throws JsonProcessingException, NotFoundException {

        Revision caller = revisionService.findById(relationBody.getCallerId());
        Revision callee = revisionService.findById(relationBody.getCalleeId());

        if(caller == null)
            throw new NotFoundException("Caller not found");
        if(callee == null)
            throw new NotFoundException("Callee not found");

        Relation relation = new Relation();
        relation.setCaller(caller);
        relation.setCallee(callee);
        relation.setOwner(caller);
        return relationService.saveRelation(relation);

    }

    @RequestMapping(value = "/{id}/annotation", method = RequestMethod.POST )
    public Relation createAnnotation(@PathVariable Long id, @RequestBody Annotation annotation) throws JsonProcessingException, NotFoundException {
        Relation relation = getRelation(id);
        relation.setAnnotation(annotation.getName(), annotation.getValue());
        return relationService.saveRelation(relation);
    }

    @RequestMapping(value = "/{id}/annotations", method = RequestMethod.POST )
    public Relation createAnnotations(@PathVariable Long id, @RequestBody List<Annotation> annotations) throws JsonProcessingException, NotFoundException {
        Relation relation = getRelation(id);
        for(Annotation annotation : annotations)
            relation.setAnnotation(annotation.getName(), annotation.getValue());
        return relationService.saveRelation(relation);
    }
}
