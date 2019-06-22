import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService,Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Router} from "@angular/router";

@Component({
  selector: 'app-eventcreate',
  templateUrl: './eventcreate.component.html',
  styleUrls: ['./eventcreate.component.css']

})
export class EventcreateComponent implements OnInit {
  profileForm;
  meta:Meta;
  eventRef: AngularFirestoreCollection<any>;
  constructor(private router:Router,private fb: FormBuilder,private authservice:AuthService,private db: AngularFirestore, private dc :DatechopperService) {
    
   }

  ngOnInit() {
     //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
       this.eventRef = this.db.collection<any>(this.meta.CHURCH_ID+'/cms/messages');
       //Create new form prepopulate with metadata from user credentials
       this.profileForm = this.fb.group({
          title: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(25)]],
          body: ['',[Validators.required,Validators.minLength(9)]],
          message_type:['event'],
          content_type:['text'],
          is_sent:[false],
          start_date: ['',[Validators.required,this.datesRangeValidator()]],
          end_date:['',[Validators.required,this.datesRangeValidator()]],
          start_time:[''],
          end_time:[''], 
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
        let std; 
        let etd;
        let regex = /-/gi;
        if(this.profileForm.controls['start_date'].value&&this.profileForm.controls['end_date'].value)
        {
          std = this.dc.getDateFromMaterialDate(this.profileForm.controls['start_date'].value)
          etd = this.dc.getDateFromMaterialDate(this.profileForm.controls['end_date'].value)
        }
        else{
          this.profileForm.controls['start_date'].setErrors(null);
          this.profileForm.controls['end_date'].setErrors(null );
          return null
        }

        const min = Number(std.replace(regex,''));
        const max = Number(etd.replace(regex,''));

       

        if(min>max){
          forbidden = true;
          this.profileForm.controls['start_date'].setErrors({'datesrange': true} );
          this.profileForm.controls['end_date'].setErrors({'datesrange': true} );
        }
        else{
          this.profileForm.controls['start_date'].setErrors(null);
          this.profileForm.controls['end_date'].setErrors(null );
        }
    
      return forbidden ? {'datesrange': true} : null;
    };
  }
}

get title(){
  return this.profileForm.get('title');
}

get body(){
  return this.profileForm.get('body');
}

get start_date(){
  return this.profileForm.get('start_date');
}


get end_date(){
  return this.profileForm.get('end_date');
}

onSubmit(){
    //Convert from Material Date picker dates to standard dates
    this.profileForm.value.start_date = this.dc.getDateFromMaterialDate(this.profileForm.value.start_date);
    this.profileForm.value.end_date = this.dc.getDateFromMaterialDate(this.profileForm.value.end_date);
    
    console.warn(this.profileForm.value);
    this.eventRef.add(this.profileForm.value);
    this.viewList();
  }
 viewList(){
    this.router.navigate(["events"]);
  }

}

