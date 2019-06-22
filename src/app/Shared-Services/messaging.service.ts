import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../Shared-Services/auth.service'
import { group } from '@angular/animations';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private db: AngularFirestore,
    private fns: AngularFireFunctions,) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
       //if token is request is successfull 
       //go get the users document 
           this.db.doc(AuthService.CHURCH_ID+'/membership/members/'+userId)
           .valueChanges().subscribe(x=>{
                  //check of the users subscribed group if it matches the admin group in
                 if(x['subscribed_group_id']){
                    if(x['subscribed_group_id'] != x['admin_group_id']){
                        //unsubcsribe
                        if(x['admin_group_id']){
                          this.unSubscribe(userId,x['admin_group_id'],token, true)
                        }
                        else{
                          this.unSubscribe(userId,x['admin_group_id'],token, false)
                        } 
                    }
                    else{
                      console.log("no subscription update")
                    }
                 }
                 else{
                      //only subscribe
                      if(x['admin_group_id']){
                        this.subscribe(userId,x['admin_group_id'],token)
                      }
                      else{
                        console.log('no group to subscribe to');
                      }
                      
                        
                 }

           })

      })
  }

  saveToken(){

  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
       // console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

  unSubscribe(user_id,admin_group_id,token,subscribe){
      //count unsubscribed times and

      this.db.doc(AuthService.CHURCH_ID+'/membership/groups/'+ admin_group_id).valueChanges().subscribe(
       f=>{
         if(f){
          let groups:string[] = f['inherited'];
          const callable = this.fns.httpsCallable('unsubscribeFromTopic');
          callable({ token: token,topic:admin_group_id}).subscribe(o=>{
            console.log("self unSubscription on"+admin_group_id)
          })
          let i = 0;
          groups.forEach(x=>{
            //run unsubscription
            
            callable({ token: token,topic:x }).subscribe(y=>{
              console.log(y);
              i++;
              if(subscribe && groups.length == i){
                  console.log(`${i} out of ${groups.length} unsubsribed topics`)
                  this.subscribe(user_id,admin_group_id,token);
              }   
            })
         
          }) 
         }
          
         }       
      )   
  }


  subscribe(user_id,admin_group_id,token){
    let i = 0;
    this.db.doc(AuthService.CHURCH_ID+'/membership/groups/'+ admin_group_id).valueChanges().subscribe(
      f=>{
        let groups:string[] = f['inherited'];
        const callable = this.fns.httpsCallable('subscribeToTopic');
        callable({ token: token,topic:admin_group_id}).subscribe(o=>{
             console.log("self subscription on"+admin_group_id)
        })
          //subscribe to it self first before all inherited
        let i = 0;
        groups.forEach(x=>{
          //run subscription
         
          callable({ token: token,topic:x}).subscribe(y=>{
            console.log(y);
            i++;
            if(groups.length == i){
                console.log(`${i} out of ${groups.length}  subscribed topics on token`)
                this.updateSubscription(user_id,admin_group_id)
            }
          })
    
        })        
  })
  }

  updateSubscription(user_id,admin_group_id){
    this.db.doc(AuthService.CHURCH_ID+'/membership/members/'+user_id)
    .set({
      subscribed_group_id:admin_group_id
    }, { merge: true })
  }
}
