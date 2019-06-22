import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { group } from '@angular/animations';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface fundraising{
  title:string,
  end_date:string,
  date:number,
  month:string,
  group_id:string,
  group_name:string,
  start_date:string,
  is_sent:boolean,
  unRead:boolean
}
interface fundraisingId extends fundraising{
  id:string
}

@Component({
  selector: 'app-fundraising',
  templateUrl: './fundraising.component.html',
  styleUrls: ['./fundraising.component.css']
})
export class FundraisingComponent implements OnInit {
  meta:Meta;
  permissions;
  view_settings;
  reads = [];
  fundraisings:fundraisingId[] = [];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService, private router:Router, private dc :DatechopperService) {
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
                if(v['fundraising'])
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
      this.authservice.setSettings(this.meta.USER_ID,'switch','fundraising',true); 
    }
    else{
      this.authservice.setSettings(this.meta.USER_ID,'switch','fundraising',false);
    }
  }

  getMine(){
    this.db.collection(this.meta.CHURCH_ID +'/cms/messages',
    ref => ref.where('message_type', '==','fundraising')
              .orderBy('timestamp','desc'))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
      let temp = [];
      x.forEach(a=>{
        const data = a.payload.doc.data() as fundraisingId;
        const id = a.payload.doc.id;
        if(this.isMine(data.group_id)){
          temp.push({ 
            id:id,
            title: data.title,
            end_date:data.end_date,
            date:this.dc.getDate(data.end_date),
            month:this.dc.getMonth(data.end_date),
            group_id:data.group_id,
            group_name:data.group_name,
            is_sent:data.is_sent,
            unRead:this.unReadTag(id)
          })
        }
      })
      this.fundraisings = [];
      this.fundraisings = this.timestampSort(temp);
    } 
    );
  }
  getAll(){
    this.db.collection(this.meta.CHURCH_ID +'/cms/messages',
    ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID)
    .where('message_type', '==','fundraising')
    .orderBy('timestamp','desc')
    )
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
      let temp = [];
      x.forEach(a=>{
        const data = a.payload.doc.data() as fundraisingId;
        const id = a.payload.doc.id;
       
          temp.push({ 
            id:id,
            title: data.title,
            end_date:data.end_date,
            date:this.dc.getDate(data.end_date),
            month:this.dc.getMonth(data.end_date),
            group_id:data.group_id,
            group_name:data.group_name,
            is_sent:data.is_sent
          })
        
      })
      this.fundraisings = [];
      this.fundraisings = this.timestampSort(temp);
    })
  }
  viewDetail(id){
    this.router.navigate(["fundraising/"+ id]);
  }

  timestampSort(items){
    items.sort(function(a, b) { 
      return b.timestamp- a.timestamp;
      })
    
    
    return items;
  }

  isMine(group_id):boolean{
    if ( this.meta.SPACE.indexOf(group_id) > -1 ) {
      return true
    } 
    else 
      {
      return false
      }
  }

  unReadTag(id:string){
    if ( this.reads.indexOf(id) > -1 ) {
       //when document is already read
       return false
    } else {
      //when document not read
      return true
    }
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
