import {environment} from 'environments/environment';
import { Component as ngComponent, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ChangelogService } from "app/services/changelog.service";
import { Changelog } from "app/models/changelog";
import { ArchitectureElementType,ArchitectureElementOperation } from "app/models/base/enums";


@ngComponent({
    templateUrl: 'livelog.component.html'
})
export class LivelogComponent implements OnInit {
    private ArchitectureElementType = ArchitectureElementType;
    private ArchitectureElementOperation = ArchitectureElementOperation;
    private changelogs: Array<Changelog>;
    constructor(private changelogService: ChangelogService) {
    }

    ngOnInit() {
        this.changelogService.getChangelogs().subscribe(changelogs => {
            this.changelogs = changelogs;
        })

        this.changelogService.getLiveChangelogs().subscribe(changelog => {
          this.changelogs.push(changelog);
        })
    }
}
