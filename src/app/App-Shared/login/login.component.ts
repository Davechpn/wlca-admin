import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure} from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router} from "@angular/router";
import { MessagingService } from "../../Shared-Services/messaging.service";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../Shared-Services/auth.service';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message;
  constructor(private messagingService: MessagingService,private db: AngularFirestore,private authservice:AuthService,
    private fns: AngularFireFunctions,private angularFireAuth:AngularFireAuth,
    private router:Router) {
  }

  ngOnInit() {
    this.angularFireAuth.authState.subscribe((response)=>{
      if (response) {
        let that = this;
       // this.router.navigate(["dashboard/"]);
        this.angularFireAuth.user.subscribe(
          (x)=>{
            console.log(x.phoneNumber)
            //set listeners for user with this number
            that.db.collection(AuthService.CHURCH_ID+'/membership/members/',ref=>ref.where('cell','==',x.phoneNumber).limit(1))
            .snapshotChanges().subscribe(a=>{
            
              if(a.length>0){
                that.db.collection(AuthService.CHURCH_ID+'/membership/members/',ref=>ref.where('cell','==',x.phoneNumber).limit(1))
                .snapshotChanges().flatMap(result => result).subscribe(f=>{
                console.log(f.payload.doc.data());

                this.messagingService.requestPermission(f.payload.doc.id)
                this.messagingService.receiveMessage()
                this.message = this.messagingService.currentMessage
               
                if(f.payload.doc.data()['admin_group_id']){
                  this.authservice.setUpUser(
                    f.payload.doc.id,
                    f.payload.doc.data()['name'],
                    f.payload.doc.data()['admin_group_id'],
                    f.payload.doc.data()['role'],
                    f.payload.doc.data()['role_id'],
                    )
                }
                else{
                   console.log("has no admin group_id")
                   this.authservice.updateLoadedState(true);
                   this.router.navigate(["register/"]);
                }
                })

              }else{
                console.log("has no record")
                this.authservice.updateLoadedState(true);
                this.router.navigate(["register/"]);
              }
           
            })
          }) 
      } else {
        console.log('Logged out');
        this.authservice.updateLoadedState(true);
      }
    })
  }

  unsubscribeAuther(){
    
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.router.navigate(["dashboard/"]);
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
      
  } 

}
