import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  moduleId: module.id,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent extends DrawerPage implements OnInit {

  leaders : Leader []
  errMess: string;

  constructor(private leaderService : LeaderService,
    private changeDetectorRef:ChangeDetectorRef,
    @Inject('BaseURL') private BaseURL) {
      super(changeDetectorRef);
    }

  ngOnInit() {
    this.leaderService.getLeaders()
    .subscribe(leaders => this.leaders = leaders,
      errmess => this.errMess = <any>errmess);
  }

}
