import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}
interface member{
 name:string;
 gender:string;
 is_admin:boolean;
 cell:string;
 role:string;
}
interface memberId extends member{
 id:string
}

interface fund{
  title:string;
  target:string;
  end_date:boolean;
 }
 interface fundId extends fund{
  id:string
 }

 interface exp{
  title:string;
  amount:string;
  date:boolean;
 }
 
 interface expId extends exp{
  id:string
 }
 

@Component({
  selector: 'app-clusterdetails',
  templateUrl: './clusterdetails.component.html',
  styleUrls: ['./clusterdetails.component.css']
})
export class ClusterdetailsComponent implements OnInit, OnDestroy {
  meta:Meta
  cluster_id;
  cluster_name;
  isMine;
  isReg;
  role;
  isChild = true;

  fun_start_date;
  fun_end_date;

  exp_start_date;
  exp_end_date;

  expenditure;
  fundraising;

  expenditures = [];
  fundraisings = [];

  exp_total;
  members_total;


  members_count;
  cluster: Observable<any>;
  members = [];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private authservice:AuthService, private dc: DatechopperService ,private router:Router, private db: AngularFirestore) {
    
   }

  ngOnInit() {
    //Get the id url parameter which is the cluster id----------------------
        this.route.params.subscribe( p => 
          {
            let params  = p as param
            this.cluster_id = params.id;
            //Get Current user credentials----------------------------
            this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
              this.meta = x;
              if(x){
                //Set Authorization from meta-----------------
                if(this.meta.GROUP_ID==params.id){
                  this.isMine=true;
                  this.role = this.meta.ROLE;
                  
                 }  
                 this.isReg = this.meta.IS_MEMBER_REG;         
                //Initial fetch of cluster and members--------
                this.getDetail(this.cluster_id);
                this.getMembers(this.cluster_id);
              } 
          }) 

        //Create a start date of start of this month to initialize date filters
        //And set today as enddate this all should be moved to datechopper service
        let dt = this.dc.getDateNow().split("-") 
        let month_start  =  `${dt[0]}-${dt[1]}-01`;    
        this.fun_start_date = month_start;
        this.exp_start_date = month_start
        
        this.fun_end_date = this.dc.getDateNow();
        this.exp_end_date = this.dc.getDateNow();

        this.filterExpenses();
        this.filterFundraisings();
      }
      );
      
  }

  funSetStartDate(e){
    this.fun_start_date = this.dc.getDateFromMaterialDate(e.value);
    this.filterFundraisings();
  }
  funSetEndDate(e){
    this.fun_end_date =  this.dc.getDateFromMaterialDate(e.value);   
    this.filterFundraisings();
  }

  expSetStartDate(e){
    this.exp_start_date = this.dc.getDateFromMaterialDate(e.value);
    this.filterExpenses();
  }
  expSetEndDate(e){
    this.exp_end_date =  this.dc.getDateFromMaterialDate(e.value);
    this.filterExpenses();
    
  }
  
  getDetail(id){
    //We already have cluster id so we use valueChanges()
    this.cluster = this.db.doc(this.meta.CHURCH_ID+'/membership/groups/'+id+'/').valueChanges();
    this.cluster.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.cluster_name = x['name']
      if(x['parent_id']==this.cluster_id){
          this.isChild = true;
      }
      if(this.cluster_id==this.meta.GROUP_ID){
          this.isChild = false;
      }
    })
  }

  getMembers(id){
    this.db.collection(this.meta.CHURCH_ID+'/membership/members/', ref => ref.where(id, '==', true))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>
        {
          let i = 0;
          let temp = [];
          x.forEach(a=>{
            const data = a.payload.doc.data() as member;
            
            const id = a.payload.doc.id;
            temp.push({  
              id:id,
              name: data.name,
              cell:data.cell,
              is_admin:data.is_admin,
              gender:data.gender,
              role:data.role
              //fetch member role and apply tagging boolean here...
             }) ;
            i++;
          })
          this.members_total = i;
          this.members = [];
          this.members = temp;
        }
      
     
    );
  }

  gotToNew(){
    this.router.navigate(["/members/new"]);
  }

  gotToAdd(){
    this.router.navigate(["/clusters/members/"+this.cluster_id]);
  }
  viewDetail(id){

    this.router.navigate(["/members/"+this.cluster_name +"/"+id]);
  }
  viewDetailFundraising(id){
    
    this.router.navigate(["/fundraising/"+id]);
  }
  viewDetailExpense(id)
  {
    this.router.navigate(["/expenditure/"+id]);
  }
  filterExpenses(){
    this.expenditures = []
     //get expenditures
     this.db.collection(this.meta.CHURCH_ID+'/funds/receipts/',
      ref => ref.where('group_id', '==',this.cluster_id)
                .where('date', '>=', this.exp_start_date)
                .where('date', '<=', this.exp_end_date) 
                .where('type', '==', 'expense')   
     ).snapshotChanges()
     .pipe(takeUntil(this.unsubscribe))
     .subscribe(x=>{
        //Add each expenditure amount to get total
         
         let temp_exp:expId[] = [];;
         let temp_total = 0;
         x.forEach(y=>{
          
          let z = y.payload.doc.data() as exp
          temp_exp.push({
            id:y.payload.doc.id,
            title:z.title,
            amount:z.amount,
            date:z.date
          })
          temp_total = temp_total + Number(z.amount)
         })
         this.exp_total = temp_total;        
         this.expenditures = temp_exp;
         
     })
    
  }

  filterFundraisings(){
        this.fundraisings = [];
        // Get All fundraising
        this.db.collection(this.meta.CHURCH_ID+'/cms/messages/', 
        ref => ref.where('inherited', 'array-contains', this.cluster_id)
                  .where('end_date', '>=', this.fun_start_date)
                  .where('end_date', '<=', this.fun_end_date) 
                  .where('message_type', '==', 'fundraising')
        ).snapshotChanges()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(x=>{
            //Add each receipt amount to get total
            let temp_funds:fundId[] = [];
            
            x.forEach(y=>{
               
                let z = y.payload.doc.data() as fund;
                temp_funds.push({
                    id:y.payload.doc.id,
                    title:z.title,
                    end_date:z.end_date,
                    target:z.target
                })
              
            })
                     
            
            this.fundraisings = temp_funds
        })

  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
