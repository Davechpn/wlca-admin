import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { ActivatedRoute, Router} from "@angular/router";
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}

@Component({
  selector: 'app-paypledge',
  templateUrl: './paypledge.component.html',
  styleUrls: ['./paypledge.component.css']
})
export class PaypledgeComponent implements OnInit,OnDestroy {

  meta:Meta;
  profileForm:FormGroup;
  receiptRef: AngularFirestoreCollection<any>;
  pledgeRef: AngularFirestoreCollection<any>;
  id;
  pledged;
  fundraising_id;
  payment_methods = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'bank', viewValue: 'Bank'},
    {value: 'ecocash', viewValue: 'Ecocash'}
  ]; 
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private router:Router,private authservice:AuthService,private fb: FormBuilder,private db: AngularFirestore, private dc :DatechopperService) {
   
   }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
      {
        let params  = p as param
        this.id = params.id;
         //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.subscribe(x=>{
          this.meta = x;
          if(x){
            
            this.receiptRef = this.db.collection<any>(this.meta.CHURCH_ID+'/funds/receipts') 
            //Create new form prepopulate with metadata from user credentials
            this.profileForm = this.fb.group({
              title: [''],
              is_send:[false],
              date: [this.dc.getDateNow()],
              start_date: [this.dc.getDateNow()],
              amount: ['',[Validators.required]],
              payment_method:['',[Validators.required]],
              fundraising_id:[''],
              type:['receipt'],
              user_id:[this.meta.USER_ID],
              group_id:[this.meta.GROUP_ID],
              group_name:[this.meta.GROUP_NAME],
              posted_by:[this.meta.AUTHOR_NAME],    
              created_date:[this.dc.getDateNow()],
              timestamp:[this.dc.getTimestamp()],
              inherited:[this.meta.INHERITED_PLUS_ME]
          });
            this.getDetails(this.id);

          } 
        })
      }
      );
  }



getDetails(id){
  this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+id)
  .valueChanges()
  .pipe(takeUntil(this.unsubscribe))
  .subscribe(
    x=>{
        console.log(x);
        this.profileForm.controls['title'].setValue(x['title'].replace('Pledge','').replace('from','From'), );      
        this.profileForm.controls['amount'].setValue(x['amount'] );  
        this.pledged = x['amount'];
        this.profileForm.controls['fundraising_id'].setValue(x['fundraising_id'] ); 
        this.fundraising_id = x['fundraising_id'];
        this.profileForm.controls['title'].disable();
        

        console.log(this.profileForm.value);

    }
  )


}

get amount(){
  return this.profileForm.get('amount');
}


get payment_method(){
  return this.profileForm.get('payment_method');
}


onSubmit(){
  console.warn(this.profileForm.value);
  this.profileForm.value.message_type = "receipt";
  this.profileForm.controls['title'].enable();
  console.warn(this.profileForm.value);
  this.receiptRef.add(this.profileForm.value)
    this.profileForm.controls['title'].disable();
    //subtract if pledge amount if less than amount entered delete
    if(this.profileForm.value.amount>=this.pledged){
      this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+this.id).delete()
    
    }else{
     //else modifiy pledge with the difference
     let diff:number = Number(this.pledged) - Number(this.profileForm.value.amount);
     console.log(diff);
     this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+this.id).set({
      amount:diff
    }, { merge: true })
    }
    this.viewDetail()
}

viewDetail(){
  this.router.navigate(["fundraising/"+ this.fundraising_id]);
}

ngOnDestroy(){
  console.log('ngOnDestory');
  this.unsubscribe.next();
  this.unsubscribe.complete();
}

}
