import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}

interface receipt{
  title:string;
  date:string;
  amount:number;
  payment_method:string;
}
interface receiptId extends receipt{
  id:string
}


@Component({
  selector: 'app-fundraisingdetails',
  templateUrl: './fundraisingdetails.component.html',
  styleUrls: ['./fundraisingdetails.component.css']
})
export class FundraisingdetailsComponent implements OnInit, OnDestroy {
  meta:Meta;
  isMine = false;
  role;

  fundraising: Observable<any>;
  receipts:receiptId[]; 
  pledges:receiptId[];
  funds_total = 0;
  pledges_total = 0;
  id;
  due;
  reads = [];
  year;

  rec_start_date;
  rec_end_date;

  ple_start_date;
  ple_end_date;
  
  recieptsView = "raised";

  readRef: AngularFirestoreCollection<any>;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private dc: DatechopperService, private authservice:AuthService,private db: AngularFirestore, private router:Router) {
    
   }

  ngOnInit() {
    //Get the id url parameter which is the fundraising id----------------------
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
      {
        let params  = p as param
       
        this.id = params.id;
      
         //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
          this.meta = x;
          if(x){
        
            let dt = this.dc.getDateNow().split("-") 
            let month_start  =  `${dt[0]}-${dt[1]}-01`;    
            // this.rec_start_date = month_start;
            // this.ple_start_date = month_start
            this.rec_end_date = this.dc.getDateNow();
            this.ple_end_date = this.dc.getDateNow();
            this.getDetail(params.id)
           
          } 
        }) 
      }

      );
  }
  switchTab(event){
     switch(event){
      case 0:
          this.recieptsView = "raised"
         break;
         case 1:
          this.recieptsView = "pledged"
         break;

     }
  }

  recSetStartDate(e){
    this.rec_start_date = this.dc.getDateFromMaterialDate(e.value);
    this.getReceipts(this.id);
  }
  recSetEndDate(e){
    this.rec_end_date =  this.dc.getDateFromMaterialDate(e.value);   
    this.getReceipts(this.id);
  }

  pleSetStartDate(e){
    this.ple_start_date = this.dc.getDateFromMaterialDate(e.value);
    this.getPledges(this.id);  
  }
  pleSetEndDate(e){
    this.ple_end_date =  this.dc.getDateFromMaterialDate(e.value);
    this.getPledges(this.id);  
    
  }
  
  getDetail(id){
    //We already have fundraising id so we use valueChanges()
    this.fundraising = this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+id+'/').valueChanges();
    this.fundraising.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
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
      this.due = this.dc.getDate(x['end_date'])+" " + this.dc.getMonth(x['end_date']);
      this.year = this.dc.getYear(x['end_date'])
      this.rec_start_date = x['start_date'];
      this.ple_start_date = x['start_date'];
      this.getReceipts(this.id);  
      this.getPledges(this.id);  
      //Set Authorization For This Document-----------------
      if(this.meta.GROUP_ID==x["group_id"]){
        this.isMine=true;
        this.role = this.meta.ROLE;
      }
    })
  }
  getReceipts(id){
    this.db.collection(this.meta.CHURCH_ID+'/funds/receipts/',
    ref=>ref.where('fundraising_id','==',id)
            .where('date', '>=', this.rec_start_date)
            .where('date', '<=', this.rec_end_date)  
    )
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
        let temp = [];
        let temp_total = 0;
        x.forEach(y=>{
          const data = y.payload.doc.data() as receipt;
          const id = y.payload.doc.id;
          temp.push({ id:id,
                   title: data.title,
                   amount:data.amount,
                   date:data.date,
                   payment_method:data.payment_method
                 })       
          temp_total = temp_total + data.amount;             
        })
        this.receipts = [];
        this.receipts = temp;
        this.funds_total = temp_total;
    })
    
    
  }

  getPledges(id){
    this.db.collection(this.meta.CHURCH_ID+'/cms/messages/',ref=>
    ref.where('message_type','==','pledge')
       .where('fundraising_id','==',id)
       .where('date', '>=', this.ple_start_date)
       .where('date', '<=', this.ple_end_date))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
        let temp = [];
        let temp_total = 0;
        x.forEach(y=>{
          const data = y.payload.doc.data() as receipt;
          const id = y.payload.doc.id;
          temp.push({ id:id,
                   title: data.title.replace('Pledge','').replace('from',''),
                   amount:data.amount,
                   date:data.date,
                   payment_method:data.payment_method
                 })       
                 temp_total = temp_total + data.amount;             
        })
        this.pledges=[]
        this.pledges = temp;
        this.pledges_total = temp_total;
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
  gotToAdd(){
    this.router.navigate(["/fundraising/receipts/add/"+this.recieptsView+"/"+this.id]);
  }

  gotToPayPledge(id){
    if(this.isMine){
      this.router.navigate(["/fundraising/pledges/pay/"+id]);
    }
  
  }

  cancel(){
   // this.db.doc(this.meta.CHURCH_ID+'/funds/fundraising/'+this.id+'/').delete();
    this.router.navigate(['/fundraising'])
  }

  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


}
