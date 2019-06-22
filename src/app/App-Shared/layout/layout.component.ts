import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  meta:Meta;
  group_name;
  church_name;
  public loading = false;

  constructor(private spinner: NgxSpinnerService, private authservice:AuthService, private router:Router,private angularFireAuth:AngularFireAuth,) { }

  ngOnInit() {

    this.authservice.currentUser.subscribe(x=>{
      if(x){
        this.meta = x;
        this.church_name = this.meta.CHURCH_NAME;
        this.group_name = this.meta.GROUP_NAME;
        this.loading = true;
      }
     
  }) 

  }
 

}
