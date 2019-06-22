import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta} from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.component.html',
  styleUrls: ['./eventdetails.component.css']
})
export class EventdetailsComponent implements OnInit, OnDestroy {
  meta:Meta;
  isMine = false;
  role;
  id;
  reads = [];
  from_date:string;
  to_date:string;
  year
  readRef: AngularFirestoreCollection<any>;
  cevent: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute, private dc:DatechopperService, private authservice:AuthService, private db: AngularFirestore,private router:Router) {
    
   }

  ngOnInit() {
    //Get the id url parameter which is the event id----------------------
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
      {
        let params  = p as param
        this.id=params.id;
        //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
          this.meta = x;
          if(x){
       
            this.getDetail(params.id)
          } 
        }) 
      }
      );
  }
  
  getDetail(id){
    //We already have event id so we use valueChanges()
    this.cevent = this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+id+'/').valueChanges();
    this.cevent.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      //Check and mark as read;
      this.authservice.readMessages.pipe(takeUntil(this.unsubscribe)).subscribe(r=>{
        this.reads = r;
        if(r){
          //Initial fetch of event--------
          if(this.unReadTag(id)){
            this.readMark();
          }
        }
      }) 
    
      this.from_date = this.dc.getDate(x['start_date'])+" " + this.dc.getMonth(x['start_date']);
      if(x['start_date']!= x['end_date']){
        this.to_date = this.dc.getDate(x['end_date'])+" " + this.dc.getMonth(x['end_date']); 
      }
      this.year = this.dc.getYear(x['start_date'])
      //Set Authorization For This Document-----------------
      if(this.meta.GROUP_ID==x["group_id"]){
        this.isMine=true;
        this.role = this.meta.ROLE;
      }
    })
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

  readMark(){
    //create new read doc
    this.readRef = this.db.collection<any>(this.meta.CHURCH_ID+'/cms/reads');
    this.readRef.add({message_id:this.id,user_id:this.meta.USER_ID});
  }

  delete(){
    this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+this.id+'/').delete();
    this.viewList();
  }

  viewList(){
    this.router.navigate(["events"]);
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

 
}
