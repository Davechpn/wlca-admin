import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

export interface RouteInfo {
  path: string;
  title: string;
  short_name:string;
  icontype: string;
  show_count: boolean;
  unread_count: string;
  is_active:boolean
}




//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'STATISTICS',
    short_name:'STATISTICS',
    icontype: '../../../assets/mat-icons/analytics.svg',
    show_count: false,
    unread_count: "",
    is_active:false,
    },
  {
  path: '/clusters',
  title: 'NETWORK',
  short_name: 'NETWORK',
  icontype: '../../../assets/mat-icons/worlwide.svg',
  show_count: false,
  unread_count: "",
  is_active:false
},{
  path: '/events',
  title: 'EVENTS',
  short_name:'EVENTS',
  icontype: '../../../assets/mat-icons/calendar.svg',
  show_count: true,
  unread_count: "",
  is_active:false
},
{
  path: '/word',
  title: 'CONTENT',
  short_name:'CONTENT',
  icontype: '../../../assets/mat-icons/open-magazine.svg',
  show_count: true,
  unread_count: "",
  is_active:false
},
{
  path: '/notices',
  title: 'NOTICES',
  short_name:'NOTICE',
  icontype: '../../../assets/mat-icons/notification.svg',
  show_count: true,
  unread_count: "",
  is_active:false
},
{
  path: '/fundraising',
  title: 'FUNDRAISING',
  short_name:'FUNDS',
  icontype: '../../../assets/mat-icons/money-bag.svg',
  show_count: true,
  unread_count: "",
  is_active:false
},{
  path: '/expenditure',
  title: 'EXPENDITURE',
  short_name:'XPENSES',
  icontype: '../../../assets/mat-icons/money-spend.svg',
  show_count: false,
  unread_count: "",
  is_active:false
},
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  meta;
  reads = [];
  routes = [];
  events_count:number = 0;
  notices_count:number = 0;
  fundraising_count:number = 0;
  word_count:number = 0;
  menuItems: any[];
  active_index = 0;

  

  constructor(private router:Router,private db: AngularFirestore,private authservice:AuthService,) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
        this.authservice.readMessages.subscribe(r=>{
         if(r){
          if(this.reads != r){
            this.reads = r;
            this.getUnReadCounts();
          }
          
         }
        }) 
      } 
  }) 
  }

  navigate(path,active_index){
   this.router.navigate([path]);
   //change active index
   //remove the current one
   this.menuItems[this.active_index]['is_active'] = false;
   this.menuItems[active_index]['is_active'] = true;
   this.active_index = active_index;
  }

  getUnReadCounts(){
    this.db.collection(this.meta.CHURCH_ID+'/cms/messages').snapshotChanges().subscribe(
      (x)=>
       { 
          this.events_count = 0;
          this.notices_count = 0;
          this.fundraising_count = 0;
          this.word_count = 0;
        
         x.forEach((y)=> {         
         if(this.isMine(y.payload.doc.data()['group_id'])){

              if(this.unReadTag(y.payload.doc.id)){
                console.log("unread")
                switch(y.payload.doc.data()['message_type']){
                  case 'event':
                    this.events_count++
                  break
                  case 'notice':
                    this.notices_count++
                  break
                  case 'word':
                    this.word_count++
                  break
                  case 'fundraising':
                    this.fundraising_count++
                  break
                }
              }
         } 
        
    })
    console.log(`events: ${this.events_count}
                 notices: ${this.notices_count}
                 word: ${this.word_count} 
                 fundraising: ${this.fundraising_count}`)
    this.menuUnReadTag();

  })
}
menuUnReadTag(){
  this.routes = [];
  ROUTES.forEach(
    (x)=>{
      let count;
      switch(x.title){
        case 'EVENTS':
         count = this.events_count
        break
        case 'NOTICES':
         count = this.notices_count
        break
        case 'CONTENT':
         count = this.word_count
        break
        case 'FUNDRAISING':
         count = this.fundraising_count
        break
      }
      if(count==0){
        count = " ";
      }
      this.routes.push({
        path: x.path,
        title: x.title,
        short_name:x.short_name,
        icontype: x.icontype,
        show_count: x.show_count,
        unread_count: count,
        is_active:x.is_active
      })
    }
  )
  this.menuItems = [];
  this.menuItems = this.routes.filter(menuItem => menuItem);
}
isMine(group_id):boolean{
  if (  this.meta.SPACE.indexOf(group_id) > -1 ) {
    return true
  } 
  else 
    {
    return false
    }
}
unReadTag(id:string){
  if(this.reads){
    if ( this.reads.indexOf(id) > -1 ) {
      return false
   } else {
     return true
   }
  }

}

}
