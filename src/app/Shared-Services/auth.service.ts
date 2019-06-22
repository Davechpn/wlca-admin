import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';

export interface Meta {
  CHURCH_ID:string;
  CHURCH_NAME:String;
  GROUP_ID:string;
  GROUP_NAME:string;
  AUTHOR_NAME:string;
  USER_ID:string;
  PARENT_GROUP_NAME:string; 
  PARENT_ID:string;
  IS_MEMBER_REG:string;
  ROLE:string;
  CC:string;
  INHERITED_PLUS_ME :string[];
  SPACE:string

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  
  public static CHURCH_ID = "dancfl";
  public static CHURCH_NAME = "Disciple All Nations";
  public static CC = "+263";
 

  currentUser = new BehaviorSubject(null);
  readMessages = new BehaviorSubject(null);
  permissions = new BehaviorSubject(null);
  viewSettings = new BehaviorSubject(null);
  loadedState  = new BehaviorSubject(null);
  constructor(private db: AngularFirestore,private router:Router) {
  }

  setUpUser(user_id,user_name,admin_group_id,role,role_id){
  
   
    this.db.doc(AuthService.CHURCH_ID+'/membership/groups/'+admin_group_id).snapshotChanges()
                .subscribe(x=>{
                  
                 console.log(x);
                  let inherited:string[] = []
                  inherited = x.payload.data()['inherited'];
                  inherited.push(admin_group_id);
                  
                  //look for children
                  let that = this;
                  this.db.collection(AuthService.CHURCH_ID+'/membership/groups/',ref=>ref.where('parent_id','==',admin_group_id))
                  .snapshotChanges().subscribe(
                    (a)=>{
                      let children = []
                      a.forEach(b=>{
                         children.push(b.payload.doc.id)
                      })
                      that.currentUser.next( {
                        CHURCH_ID:AuthService.CHURCH_ID,
                        CHURCH_NAME:AuthService.CHURCH_NAME,
                        CC:AuthService.CC,
                        USER_ID:user_id,
                        AUTHOR_NAME: user_name,
                        GROUP_ID:admin_group_id,
                        ROLE:role,                     
                        PARENT_ID:x.payload.data()['parent_id'],
                        GROUP_NAME:x.payload.data()['name'],
                        IS_MEMBER_REG:x.payload.data()['is_reg'],                     
                        INHERITED_PLUS_ME:inherited,
                        SPACE:children.concat(inherited)
                    })
                    that.getReads(user_id);
                    that.getPermissions(role_id)
                    that.getSettings(user_id)
                
                    }
                  )
                
      //Now that everything is setup navigate
      if(admin_group_id){
        this.router.navigate(["dashboard/"]);
      }
      else{
        this.router.navigate(["register/"]);
      }
     
    })
  }
  getReads(user_id){
    this.db.collection(AuthService.CHURCH_ID+'/cms/reads',ref=>ref.where('user_id','==',user_id))
    .snapshotChanges().subscribe(x=>{
      let reads = [];
      x.forEach(y =>{
                reads.push(y.payload.doc.data()['message_id'])
      })
      this.readMessages.next(reads);
     // console.log(reads);
    })
  }
  getPermissions(role_id){
    this.db.doc(AuthService.CHURCH_ID+'/membership/roles/'+role_id).snapshotChanges()
    .subscribe(x=>{
      this.permissions.next(x.payload.data());
    })
  }

  getSettings(user_id){
    this.db.doc(AuthService.CHURCH_ID+'/membership/members/'+user_id+'/settings/switch').snapshotChanges()
    .subscribe(x=>{
      console.log(x.payload.data());
      this.viewSettings.next(x.payload.data());
    })
  }

  setSettings(user_id:string,type:string,page:string,state:boolean){
    this.db.doc(AuthService.CHURCH_ID+'/membership/members/'+user_id+'/settings/'+type)
    .set({
      [page]:state
    }, { merge: true })
    
  }
  updateLoadedState(state:boolean){
    this.loadedState.next({
      loaded:state
      
    });
  }

}
