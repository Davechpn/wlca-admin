import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router} from "@angular/router";
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}

@Component({
  selector: 'app-noticedetails',
  templateUrl: './noticedetails.component.html',
  styleUrls: ['./noticedetails.component.css']
})
export class NoticedetailsComponent implements OnInit, OnDestroy {
  meta:Meta;
  isMine = false;
  role;
  id;
  date
  year
  notice: Observable<any>;
  reads = [];
  readRef: AngularFirestoreCollection<any>;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private dc:DatechopperService,private authservice:AuthService,private db: AngularFirestore, private router: Router) {
    
   }

  ngOnInit() {
    //Get the id url parameter which is the notice id----------------------
    this.route.params.subscribe( p => 
      {
        let params  = p as param
        this.id = params.id;
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
    //We already have notice id so we use valueChanges()
    this.notice = this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+id+'/').valueChanges();
    this.notice.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
   
      this.authservice.readMessages.pipe(takeUntil(this.unsubscribe)).subscribe(r=>{
        this.reads = r;
        if(r){
          //Initial fetch of event--------
          if(this.unReadTag(id)){
            this.readMark();
          }
        }
      }) 
      this.date = this.dc.getDate(x['created_date'])+" " + this.dc.getMonth(x['created_date']);
      this.year = this.dc.getYear(x['created_date'])
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
   this.router.navigate(['/notices']);
   this.viewList;
  }

  
  viewList(){
    this.router.navigate(["notices"]);
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
