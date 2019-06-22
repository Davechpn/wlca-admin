import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router} from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string,
  group:string
}


@Component({
  selector: 'app-memberdetails',
  templateUrl: './memberdetails.component.html',
  styleUrls: ['./memberdetails.component.css']
})
export class MemberdetailsComponent implements OnInit {
  meta:Meta;
  member: Observable<any>;
  isMine = false;
  isReg;
  group_id;
  role;
  id;
  roles = [];
  meornotmine = false;
  current_group_name;
  admin_group_name;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private authservice:AuthService,private db: AngularFirestore,private router:Router) { }

  ngOnInit() {
    //Get the id url parameter which is the member id----------------------
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
      {
        let params  = p as param
        this.id = params.id;
        this.current_group_name = params.group;
        //this.group_id = params.group;
        
        //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.subscribe(x=>{
          this.meta = x;
          if(x){
            //Initial fetch of member--------
            this.getDetail(params.id)
            this.isReg = this.meta.IS_MEMBER_REG;
            
          } 
        }) 
      });
  }

getDetail(id){
  //We already have member id so we use valueChanges()
    this.member = this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+id+'/').valueChanges();
    this.member.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.getRoles(x['role_id']);
      if(x['role_id']){
        this.checkforDelegaton(x['admin_group_id'])
      }
   
      //Set Authorization For This Document-----------------
      if(this.meta.GROUP_ID==x["group_id"]){
        this.isMine=true;
        this.role = this.meta.ROLE;
      }
    })
   this.db.collection(this.meta.CHURCH_ID+'/membership/groups',ref=>ref.where('name','==',this.current_group_name).limit(1))
   .snapshotChanges().subscribe(x =>{
    this.group_id =  x[0].payload.doc.id;
   })
  }

checkforDelegaton(group_id){
  //set role editing permissions
  this.db.doc(this.meta.CHURCH_ID+'/membership/groups/'+group_id).valueChanges()
  .pipe(takeUntil(this.unsubscribe))
  .subscribe(x=>{
        //if the adminstered group is my child
        if(x['parent_id']==this.meta.GROUP_ID||group_id==this.meta.GROUP_ID){
          if(this.id == this.meta.USER_ID){
            this.meornotmine = true;
          }
          else{
            this.meornotmine  = false;
          }
        }
        //if the person is not me
        //if the administerd group is this one

        //set the admin_group_name
        this.admin_group_name = x['name'];
  })

}

getRoles(member_role_id){
  this.db.collection(this.meta.CHURCH_ID+'/membership/roles').snapshotChanges()
  .pipe(takeUntil(this.unsubscribe))
  .subscribe(x=>{
        let temp = [];
        x.forEach(y=>{ 
          let hasMember=false;
          if(member_role_id == y.payload.doc.id){
              hasMember = true;
          }
          temp.push({
            id:y.payload.doc.id,
            name:y.payload.doc.data()['name'],
            has_member:hasMember
          })
        })
       
        this.roles = []
        this.roles = temp;
    })
}

toggleRole(e,role_id,role_name){
  if(e.checked){
    this.putInRole(role_id,role_name) 
  }
  else{
    this.removeFromRole()
  }
}
putInRole(role_id,role_name){
  
  this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+this.id).set({
    role_id:role_id,
    role:role_name,
    admin_group_id:this.group_id
  }, { merge: true })
}
removeFromRole(){
  this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+this.id).set({
    role_id:false,
    role:false,
    admin_group_id:false
  }, { merge: true })
}
delete(){
  this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+this.id+'/').delete();
  this.router.navigate(['/clusters/'+this.group_id])
}
ngOnDestroy(){
  console.log('ngOnDestory');
  this.unsubscribe.next();
  this.unsubscribe.complete();
}

}
