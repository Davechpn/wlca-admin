import { Component, OnInit } from '@angular/core';
import { MessagingService } from "./Shared-Services/messaging.service";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { AuthService } from './Shared-Services/auth.service';


import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'wlca-pwa';
  data$
  topic = 'Ia9njzGG6DD9552WJ9Ou';
  token = 'd13wFlCDdtQ:APA91bFScoZPsNyU-xlXA_bRS6eMHWnX_FLdQX0EAAf6jVhdW8TQj7vDgy3toAg8g3ADsVvfyn0L1VPKeL011pju0xch-vor8Nsfxl9N4lkDzcMIg2nKXc-jgGLMfU67xfHdCThzDIGe';
  interval;
  delayinterval;
  seconds;
  message;
 
  delayed = false;
  public loading = true;

constructor(  private messagingService: MessagingService,private db: AngularFirestore,private authservice:AuthService,
              private fns: AngularFireFunctions,private angularFireAuth:AngularFireAuth,
              private router:Router) {
             
            }
 

            ngOnInit() {
             // this.db.firestore.disableNetwork()
              let ths = this;
              this.delayinterval = setTimeout(() => {
                /** spinner ends after 5 seconds */
                //ths.delayed = true;
                this.seconds++
                clearInterval(ths.delayinterval);
            }, 16000);

            this.interval = setTimeout(() => {
              /** spinner ends after 5 seconds */
              
             // this.db.firestore.disableNetwork();
            
          }, 5000);
                  /** spinner ends after 5 seconds */
                //  this.spinner.hide();
             
                this.authservice.loadedState.subscribe(
                  x=>{
                    if(x){
                       if(x['loaded'])
                          {
                            let that = this;
                            this.interval = setTimeout(() => {
                              /** spinner ends after 5 seconds */
                              that.loading = false;
                              
                              console.log('ccleared loading');
                              clearInterval(that.interval);
                              clearInterval(that.delayinterval);
                              that.delayed = false;
                          }, 700);
                          
                     
                        
                        console.log("loading took "+ this.seconds +" seconds")
                       }
                    }
                  }
                )

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
                             this.router.navigate(["register/"]);
                          }
                          })
          
                        }else{
                          console.log("has no record")
                          this.router.navigate(["register/"]);
                        }
                     
                      })
                    }) 
                } else {
                  console.log('Logged out');
                  this.router.navigate(["login/"]);
                }
              })
            }
    
  }


  

