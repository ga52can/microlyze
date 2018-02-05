import { ArchitectureElementType, ArchitectureElementOperation } from '../models/base/enums';
import { ToasterConfig, Toast, ToasterService } from 'angular2-toaster/angular2-toaster';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { ChangelogService } from "app/services/changelog.service";
import { Changelog } from "app/models/changelog";

@Component({
    selector: 'app-modeller',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

    public disabled = false;
    public status: { isopen: boolean } = { isopen: false };
    private isLivelog: boolean = false;
    private livechangeCount: number = 0;

    private lastToast: Toast;
    private lastToastTimeout: number;

    private toasterconfig: ToasterConfig =
    new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000,
        newestOnTop: false
    });

    constructor(private changelogService: ChangelogService, private router: Router, private toasterService: ToasterService) {
    }

    showToast(changelog: Changelog) {
        let type: string = ArchitectureElementType[changelog.referenceType];
        let message: string = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + " " + ArchitectureElementOperation[changelog.operation].toLowerCase() + " (" + changelog.referenceId + ")";

        if (!this.lastToast) {
            let toastObject = { type: 'info', title: 'Architecture changed!', body: message, timeout: 0 }
            this.lastToast = this.toasterService.pop(toastObject);
        }

        this.lastToast.body = message;

        if(this.lastToastTimeout)
          window.clearTimeout(this.lastToastTimeout);

        this.lastToastTimeout = window.setTimeout(() => {
            this.toasterService.clear(this.lastToast.toastId)
            this.lastToast = this.lastToastTimeout = null;
        }, 5000)
    }

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.isLivelog = event.url == "/livelog";
                this.livechangeCount = 0;
              }
        })
        this.changelogService.getLiveChangelogs().subscribe((changelog) => {
            if (!this.isLivelog) {
                this.livechangeCount++;
                this.showToast(changelog);
            }
            else
                this.livechangeCount = 0;
        })
    }
}
