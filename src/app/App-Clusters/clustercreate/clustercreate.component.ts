import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Router} from "@angular/router";


@Component({
  selector: 'app-clustercreate',
  templateUrl: './clustercreate.component.html',
  styleUrls: ['./clustercreate.component.css']
})
export class ClustercreateComponent implements OnInit {
  meta:Meta;

  newClusterForm;
  constraintsForm:FormGroup;
  clustersRef: AngularFirestoreCollection<any>;
  marital_states = [
    {value: 'any', viewValue: 'Any'},
    {value: 'married', viewValue: 'Married'},
    {value: 'single', viewValue: 'Single'}
  ];
  gender = [
    {value: 'both', viewValue: 'Both'},
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'}
  ]; 


  constructor(private router:Router,private fb: FormBuilder,private authservice:AuthService,private db: AngularFirestore,private dc:DatechopperService ) { 
  }

  ngOnInit() {
    //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
        this.clustersRef = this.db.collection<any>(this.meta.CHURCH_ID+'/membership/groups/')
        //Create new form prepopulate with metadata from user credentials
      
        this.constraintsForm = this.fb.group({
          min_age:['', this.ageRangeValidator()],
          max_age:['', this.ageRangeValidator()],
          marital_status:[''],
          gender:[''],
        })

        this.newClusterForm = this.fb.group({
          name: ['',[Validators.required,Validators.minLength(9)]],
          cell: ['',[Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(9),Validators.maxLength(9)]],
          contact_name: ['',[Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.minLength(8)]],
          address: ['',[Validators.minLength(9)]],
          agenda: ['',[Validators.required,Validators.minLength(9)]],
          constraints:this.constraintsForm,         
          is_sent:[false],
          parent_id:[this.meta.GROUP_ID],
          parent_name:[this.meta.GROUP_NAME],
          user_id:[this.meta.USER_ID],
          posted_by:[this.meta.AUTHOR_NAME],
          created_date:[this.dc.getDateNow()],
          timestamp:[this.dc.getTimestamp()],
          inherited:[this.meta.INHERITED_PLUS_ME]
      });

      
    
      } 
    }) 
  }

  ageRangeValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden = false;
      
      if(control.value){
        const max = Number(this.constraintsForm.controls['max_age'].value);
        const min = Number(this.constraintsForm.controls['min_age'].value);

        if(max<1||min<1){
          this.constraintsForm.controls['max_age'].setErrors(null);
          this.constraintsForm.controls['min_age'].setErrors(null );
          return null
        }

        if(min>max){
          forbidden = true;
          this.constraintsForm.controls['max_age'].setErrors({'agerange': true} );
          this.constraintsForm.controls['min_age'].setErrors({'agerange': true} );
        }
        else{
          this.constraintsForm.controls['max_age'].setErrors(null);
          this.constraintsForm.controls['min_age'].setErrors(null );
        }
    
      return forbidden ? {'agerange': true} : null;
    };
  }
}

  get name(){
    return this.newClusterForm.get('name');
  }
  
  get cell(){
    return this.newClusterForm.get('cell');
  }
  
  get contact_name(){
    return this.newClusterForm.get('contact_name');
  }
  
  get address(){
    return this.newClusterForm.get('address');
  }

  get agenda(){
    return this.newClusterForm.get('agenda');
  }

  get max_age(){
    return this.constraintsForm.get('max_age');
  }

  onSubmit(){
   // this.newClusterForm.value.constraints = this.constraintsForm.value;
    console.warn(this.newClusterForm.value);
    this.newClusterForm.value.cell = "+263" + this.newClusterForm.value.cell;
    this.clustersRef.add(this.newClusterForm.value)
    this.viewList();
  }
  viewList(){
    this.router.navigate(["clusters"]);
  }
}
