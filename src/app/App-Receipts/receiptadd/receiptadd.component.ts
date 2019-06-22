import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder,Validators,ValidatorFn,AbstractControl, FormGroup } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { ActivatedRoute} from "@angular/router";
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';


interface param{
  id:string;
  type:string
}

@Component({
  selector: 'app-receiptadd',
  templateUrl: './receiptadd.component.html',
  styleUrls: ['./receiptadd.component.css']
})
export class ReceiptaddComponent implements OnInit, OnDestroy {
  meta:Meta;
  profileForm: FormGroup;
  receiptRef: AngularFirestoreCollection<any>;
  pledgeRef: AngularFirestoreCollection<any>;
  id;
  fundraising_name;
  pledgeView = false;
  payment_methods = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'bank', viewValue: 'Bank'},
    {value: 'ecocash', viewValue: 'Ecocash'}
  ]; 
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private authservice:AuthService,private fb: FormBuilder,private db: AngularFirestore, private dc :DatechopperService) {
   
   }

  ngOnInit() {
    this.route.params.subscribe( p => 
      {
        let params  = p as param
        this.id = params.id;
        
        if(params.type == "pledged"){
                this.pledgeView = true;
        }
      
         //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.subscribe(x=>{
          this.meta = x;
          if(x){
            this.receiptRef = this.db.collection<any>(this.meta.CHURCH_ID+'/funds/receipts') 
            this.pledgeRef = this.db.collection<any>(this.meta.CHURCH_ID+'/cms/messages')
            this.getTitle(this.id); 
            //Create new form prepopulate with metadata from user credentials
            this.profileForm = this.fb.group({
              title: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
              message_type:[''],
              content_type:['text'],
              is_send:[false],
              date: ['',[Validators.required]],
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
          } 
        })
      }
      );
  }
getTitle(id){
  this.db.doc(this.meta.CHURCH_ID+'/cms/messages/'+id).valueChanges()
  .pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.fundraising_name = x['title']
  })
}

get title(){
    return this.profileForm.get('title');
  }
  
get amount(){
    return this.profileForm.get('amount');
  }

get date(){
    return this.profileForm.get('date');
}
  
get payment_method(){
    return this.profileForm.get('payment_method');
  }


onSubmit(){
  console.warn(this.profileForm.value);
  this.profileForm.value.fundraising_id = this.id;
  this.profileForm.value.date = this.dc.getDateFromMaterialDate(this.profileForm.value.date);
  this.profileForm.value.message_type = "receipt";
  this.receiptRef.add(this.profileForm.value);
  this.profileForm.reset();
}

onSubmitPledge(){
  console.warn(this.profileForm.value);
  this.profileForm.value.fundraising_id = this.id;
  this.profileForm.value.date = this.dc.getDateFromMaterialDate(this.profileForm.value.date);
  this.profileForm.value.message_type = "pledge";
  this.profileForm.value.body = this.profileForm.value.title + " has pledged $" + this.profileForm.value.amount + " for " + this.fundraising_name + " to "+ this.meta.GROUP_NAME + " may God Bless and add more";
  this.profileForm.value.title = "Pledge from "+ this.profileForm.value.title
  this.pledgeRef.add(this.profileForm.value);
  this.profileForm.reset();
}
ngOnDestroy(){
  console.log('ngOnDestory');
  this.unsubscribe.next();
  this.unsubscribe.complete();
}

}
