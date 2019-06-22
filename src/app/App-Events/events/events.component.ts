import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Router} from "@angular/router";
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';


interface cevent{
 title:string,
 start_date:string,
 date:number,
 month:string,
 group_id:string,
 group_name:string,
 is_sent:boolean,
 unRead:boolean
}
interface ceventId extends cevent {
  id:string
 }

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit,OnDestroy{
  meta:Meta;
  reads = [];
  permissions;
  view_settings;
  events:ceventId[] = [];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService, private router:Router, private dc:DatechopperService) {
   }

  ngOnInit() {

    this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.meta = x;
      if(x){
        this.authservice.readMessages.pipe(takeUntil(this.unsubscribe)).subscribe(r=>{
          this.reads = r;
            this.authservice.permissions.pipe(takeUntil(this.unsubscribe)).subscribe(p=>{
              this.permissions = p;
              this.authservice.viewSettings.pipe(takeUntil(this.unsubscribe)).subscribe(v=>{
                this.view_settings = v;
                
                if(v){
                  if(v['events'])
                  {
                    this.getAll();
                  }
                  else{
                    this.getMine();
                  }
                }
              })              
            }) 
        }) 
      } 
  }) 
  }
  toggleGet(e){
    if(e.checked){
      this.authservice.setSettings(this.meta.USER_ID,'switch','events',true);
    }
    else{    
      this.authservice.setSettings(this.meta.USER_ID,'switch','events',false);
    }
  }

  getMine(){  
        //create a looping list and append to html for each fetch
        this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('message_type','==','event')).snapshotChanges()
        .pipe(takeUntil(this.unsubscribe)).subscribe(
        (x)=>
         {  
           let temp=[];   
           x.forEach((y)=> {         
            let z = y.payload.doc.data() as cevent;
            const id = y.payload.doc.id;
            if(this.isMine(z.group_id)){
              temp.push({
                id:id,
                title:z.title,
                start_date:z.start_date,
                date:this.dc.getDate(z.start_date),
                month:this.dc.getMonth(z.start_date),
                group_id:z.group_id,
                group_name:z.group_name,
                is_sent:z.is_sent,
                unRead:this.unReadTag(id)
              });
            }
           
        
          })  
          this.events=[];
          this.events = this.timestampSort(temp);  
         }
       )     
  }

  getAll(){
    this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID).where('message_type','==','event'))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe)).subscribe((x=>{
         let temp=[];
         x.forEach((y)=> {                           
            let z = y.payload.doc.data() as cevent;
            const id = y.payload.doc.id;
            temp.push({
              id:id,
              title:z.title,
              start_date:z.start_date,
              date:this.dc.getDate(z.start_date),
              month:this.dc.getMonth(z.start_date),
              group_id:z.group_id,
              group_name:z.group_name,
              is_sent:z.is_sent
            });
        
          })
         this.events = [];
         this.events = this.timestampSort(temp);
        }
    ))
  }



  timestampSort(items){
    items.sort(function(a,b) {return (a.start_date > b.start_date) ? 1 : ((b.start_date > a.start_date) ? -1 : 0);} );
   
    return items;
  }

  viewDetail(id){
    this.router.navigate(["events/"+ id]);
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
    if ( this.reads.indexOf(id) > -1 ) {
       return false
    } else {
      return true
    }
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
