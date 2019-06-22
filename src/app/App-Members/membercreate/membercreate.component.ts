import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService,Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { FormBuilder,Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import {Location} from '@angular/common';
@Component({
  selector: 'app-membercreate',
  templateUrl: './membercreate.component.html',
  styleUrls: ['./membercreate.component.css']
})
export class MembercreateComponent implements OnInit {
  meta:Meta;
  profileForm;
  membersRef: AngularFirestoreCollection<any>;
  genderValues = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'}
  ]; 
  
  constructor(private location: Location,private fb: FormBuilder,private authservice:AuthService,private db: AngularFirestore, private dc :DatechopperService) { 
    
  }
 
  ngOnInit() {
     //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
        this.membersRef = this.db.collection<any>(this.meta.CHURCH_ID+'/membership/members');
        //Create new form prepopulate with metadata from user credentials
        let maxvalid = new Date().getFullYear() - 2;
        this.profileForm = this.fb.group({
          name: ['',[Validators.required,Validators.minLength(9)]],
          cell: ['',[Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(9),Validators.maxLength(9)]],
          address: ['',[Validators.minLength(9)]],
          gender: ['',[Validators.required]],
          is_married:[false],
     
          proffession: [''],
          position:[''],          
          yob:['',[Validators.required,Validators.min(1900),Validators.max(maxvalid)]],
          user_id:[this.meta.USER_ID],
          group_id:[this.meta.GROUP_ID],
          group_name:[this.meta.GROUP_NAME],
          created_by:[this.meta.AUTHOR_NAME],
          created_date:[this.dc.getDateNow()],
          timestamp:[this.dc.getTimestamp()],
          inherited:[this.meta.INHERITED_PLUS_ME],
          [this.meta.GROUP_ID]:[true]
      });
        
      } 
    })
  }
 

  onSubmit(){
    console.warn(this.profileForm.value);
    this.profileForm.value.cell = "+263" + this.profileForm.value.cell;
    this.membersRef.add(this.profileForm.value);
    this.location.back();
  }
  get name(){
    return this.profileForm.get('name');
  }
  
  get cell(){
    return this.profileForm.get('cell');
  }

  get gender(){
    return this.profileForm.get('gender');
  }

  get yob(){
    return this.profileForm.get('yob');
  }
  
  
  get address(){
    return this.profileForm.get('address');
  }

}
