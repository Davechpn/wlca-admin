import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Router} from "@angular/router";
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';


interface notice{
  title:string,
  created_date:string,
  group_name:string,
  group_id:string,
  date:number,
  month:string,
  timestamp:string,
  is_sent:boolean,
  unRead:boolean
}
interface noticeId extends notice{
  id:string
}

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit, OnDestroy {
  meta:Meta;
  permissions;
  view_settings;
  reads = [];
  notices: noticeId[] = [];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService,
     private router:Router,private dc :DatechopperService) {
    
   }

  ngOnInit() {
 
   this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
    this.meta = x;
   
    if(x){
      this.authservice.readMessages.pipe(takeUntil(this.unsubscribe)).subscribe(r=>{
        this.reads = r; 
        this.authservice.permissions.subscribe(p=>{
          this.permissions = p;
          this.authservice.viewSettings.pipe(takeUntil(this.unsubscribe)).subscribe(v=>{
            this.view_settings = v;
         
            if(v){
              if(v['notices'])
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
      this.authservice.setSettings(this.meta.USER_ID,'switch','notices',true); 
    }
    else{
      this.authservice.setSettings(this.meta.USER_ID,'switch','notices',false); 
    }
  }


  getMine(){
        //create a looping list and append to html for each fetch
        this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('message_type','==','notice')).snapshotChanges()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
        (x)=>
         {
           let temp=[];
           x.forEach((y)=> {
            let z = y.payload.doc.data() as notice;
            const id = y.payload.doc.id;
            //check if the notice belongs to any of the inherited
            if(this.isMine(z.group_id)){
              temp.push({
                id:id,
                title:z.title,
                created_date:z.created_date,
                date:this.dc.getDate(z.created_date),
                month:this.dc.getMonth(z.created_date),
                group_name:z.group_name,
                group_id:z.group_id,
                timestamp:z.timestamp,
                is_sent:z.is_sent,
                unRead: this.unReadTag(id)
              });
            }
           
        
          })
          this.notices = [];
          this.notices = this.timestampSort(temp);
         })
      }
  getAll(){
    this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID).where('message_type','==','notice'))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
      let temp=[];
      x.forEach((y)=> {
        let z = y.payload.doc.data() as notice;
        const id = y.payload.doc.id;
        temp.push({
          id:id,
          title:z.title,
          created_date:z.created_date,
          date:this.dc.getDate(z.created_date),
          month:this.dc.getMonth(z.created_date),
          group_name:z.group_name,
          group_id:z.group_id,
          timestamp:z.timestamp,
          is_sent:z.is_sent,
          unRead: this.unReadTag(id)
        })
    })
    this.notices = [];
    this.notices = this.timestampSort(temp);
  })
  }
  timestampSort(items){
    items.sort(function(a, b) { 
      return b.timestamp- a.timestamp;
      })
   
    
    return items;
  }

  viewDetail(id){
    this.router.navigate(["notices/"+ id]);
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

  isMine(group_id):boolean{
    if (this.meta.SPACE.indexOf(group_id) > -1 ) {
      return true
    } 
    else {
      return false
    }
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
