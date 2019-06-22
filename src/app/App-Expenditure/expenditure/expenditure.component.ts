import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { map } from 'rxjs/operators';
import { Router} from "@angular/router";
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface expenditure{
   title:string,
   amount:string,
   date:string,
   is_sent:boolean,
   account:string
}
interface expenditureId extends expenditure{
  id:string
}

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.css']
})
export class ExpenditureComponent implements OnInit {
  meta:Meta;
  permissions;
  view_settings;
  exp_total;
  exp_start_date;
  exp_end_date;
  items: expenditureId[];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService,private dc: DatechopperService, private router:Router) {

   }

  ngOnInit() {
    this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.meta = x;
      if(x){
        this.authservice.permissions.pipe(takeUntil(this.unsubscribe)).subscribe(p=>{
          this.permissions = p;
          this.authservice.viewSettings.pipe(takeUntil(this.unsubscribe)).subscribe(v=>{
            this.view_settings = v;
           
            if(v){
              //Create a start date of start of this month to initialize date filters
              //And set today as enddate this all should be moved to datechopper service
              let dt = this.dc.getDateNow().split("-") 
              let month_start  =  `${dt[0]}-${dt[1]}-01`;    
              this.exp_start_date = month_start
              this.exp_end_date = this.dc.getDateNow();
              if(v['expenditure'])
              {
                this.getAll();
              }
              else{
                this.getMine();
              }

            }
          }) 
          
        })
      } 
  }) 
  }

  toggleGet(e){
    if(e.checked){
      this.authservice.setSettings(this.meta.USER_ID,'switch','expenditure',true);
    }
    else{
      this.authservice.setSettings(this.meta.USER_ID,'switch','expenditure',false);
    }
  }
  expSetStartDate(e){
    this.exp_start_date = this.dc.getDateFromMaterialDate(e.value);
    if(this.view_settings['expenditure'])
              {
                this.getAll();
              }
              else{
                this.getMine();
              }
  }
  expSetEndDate(e){
    this.exp_end_date =  this.dc.getDateFromMaterialDate(e.value);
    if(this.view_settings['expenditure'])
    {
      this.getAll();
    }
    else{
      this.getMine();
    }
  }

  getMine(){
    this.items = [];
    this.db.collection(this.meta.CHURCH_ID+'/funds/receipts',
    ref => ref.where('group_id', '==', this.meta.GROUP_ID)
              .where('date', '>=', this.exp_start_date)
              .where('date', '<=', this.exp_end_date)  
              .where('type','==','expense'))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      x=>{
      let temp = [];
      let temp_total =  0;
      x.forEach(a => {
        const data = a.payload.doc.data() as expenditureId;
        const id = a.payload.doc.id;
        temp.push({ 
          id:id,
          title: data.title,
          amount:data.amount,
          date:data.date,
          is_sent:data.is_sent,
          account:data.account
        }) 
        temp_total = temp_total + Number(data.amount)
      })
      this.exp_total  = temp_total;
      this.items = temp;
    })
  }
  getAll(){
    this.items =[];
    this.db.collection(this.meta.CHURCH_ID+'/funds/receipts',
    ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID)
              .where('date', '>=', this.exp_start_date)
              .where('date', '<=', this.exp_end_date)  
              .where('type','==','expense'))
    .snapshotChanges().pipe(
      takeUntil(this.unsubscribe),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as expenditureId;
        const id = a.payload.doc.id;
        return { 
          id:id,
          title: data.title,
          amount:data.amount,
          date:data.date,
          is_sent:data.is_sent,
          account:data.account
        };
      }))
    ).subscribe(x=>{
      this.items = x;
      let temp_total = 0;
      x.forEach(y=>{
        temp_total = temp_total + Number(y.amount)
      })
      this.exp_total = temp_total;
    })

  }

  viewDetail(id){
    this.router.navigate(["expenditure/"+ id]);
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
