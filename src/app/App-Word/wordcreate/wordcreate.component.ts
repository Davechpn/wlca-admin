import { Component, OnInit } from '@angular/core';
import { FormBuilder , Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { DatechopperService} from '../../Shared-Services/datechopper.service';
import { Router} from "@angular/router";

@Component({
  selector: 'app-wordcreate',
  templateUrl: './wordcreate.component.html',
  styleUrls: ['./wordcreate.component.css']
})
export class wordcreateComponent implements OnInit {
  meta:Meta;
  profileForm;
  wordRef: AngularFirestoreCollection<any>;

  constructor(private router:Router,private fb: FormBuilder,private authservice:AuthService,private db: AngularFirestore, private dc:DatechopperService) 
  {
   
  }

  ngOnInit() {
    //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.subscribe(x=>{
      this.meta = x;
      if(x){
        this.wordRef = this.db.collection<any>(this.meta.CHURCH_ID+'/cms/messages');
        //Create new form prepopulate with metadata from user credentials
        this.profileForm = this.fb.group({
          title: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(25)]],
          summary:[''],

          body: ['',[Validators.required,Validators.minLength(9)]],
          message_type:['word'],
          content_type:['text'],
          is_sent:[false],
          start_date: [this.dc.getDateNow()],
          end_date:[''],
          user_id:[this.meta.USER_ID],
          group_id: [this.meta.GROUP_ID],
          group_name: [this.meta.GROUP_NAME],
          posted_by:[this.meta.AUTHOR_NAME],
          timestamp:[this.dc.getTimestamp()],
          created_date:[this.dc.getDateNow()],
          inherited:[this.meta.INHERITED_PLUS_ME]
    
      });
        
      } 
    }) 
  }

  get title(){
    return this.profileForm.get('title');
  }
  
  get body(){
    return this.profileForm.get('body');
  }
 

  onSubmit(){
    console.warn(this.profileForm.value);
    this.wordRef.add(this.profileForm.value);
    this.viewList();
  }


  viewList(){
    this.router.navigate(["word"]);
  }
}
