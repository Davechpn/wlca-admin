import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Router} from "@angular/router";

@Component({
  selector: 'app-expenditurecreate',
  templateUrl: './expenditurecreate.component.html',
  styleUrls: ['./expenditurecreate.component.css']
})
export class ExpenditurecreateComponent implements OnInit {
  meta:Meta;
  profileForm;
  expenditureRef: AngularFirestoreCollection<any>;

  constructor(private router:Router,private fb: FormBuilder,private authservice:AuthService, private db: AngularFirestore, private dc :DatechopperService) {
  
  }

  ngOnInit() {
     //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
        this.expenditureRef = this.db.collection<any>(this.meta.CHURCH_ID+'/funds/receipts') 
        //Create new form prepopulate with metadata from user credentials
        this.profileForm = this.fb.group({
          title: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(25)]],
          is_sent:[false],
          amount: ['',[Validators.required]],
          payment_method:[''],
          supplier:['',[Validators.required]],
          receipt_no:[''],
          account:[''],
          type:['expense'],
          date:['',[Validators.required,this.datesRangeValidator()]],
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

  datesRangeValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden = false;
      
      if(control.value){
        let td; 
        let exd;
        let regex = /-/gi;
      
          td =  this.dc.getDateNow();
          exd = this.dc.getDateFromMaterialDate(this.profileForm.controls['date'].value)
      
    

        const max = Number(td.replace(regex,''));
        const min = Number(exd.replace(regex,''));

       

        if(min>max){
          forbidden = true;
          this.profileForm.controls['date'].setErrors({'datesrange': true} );
        }
        else{
          this.profileForm.controls['date'].setErrors(null);

        }
    
      return forbidden ? {'datesrange': true} : null;
    };
  }
}

get title(){
  return this.profileForm.get('title');
}

get supplier(){
  return this.profileForm.get('supplier');
}

get amount(){
  return this.profileForm.get('amount');
}

get date(){
  return this.profileForm.get('date');
}
onSubmit(){
    
    //Convert from Material Date picker dates to standard dates
    this.profileForm.value.date = this.dc.getDateFromMaterialDate(this.profileForm.value.date)
    console.warn(this.profileForm.value);
    this.expenditureRef.add(this.profileForm.value);
    this.viewList();
  }
viewList(){
    this.router.navigate(["expenditure"]);
  }

}
