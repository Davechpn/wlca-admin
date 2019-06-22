import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService,Meta } from '../../Shared-Services/auth.service';
import { ActivatedRoute, Router} from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}
interface member{
  name:string,
  joined:boolean,
  is_married:boolean,
  yob:number,
  gender:string

}
interface memberId extends member{
  id:string
}
@Component({
  selector: 'app-memberadd',
  templateUrl: './memberadd.component.html',
  styleUrls: ['./memberadd.component.css']
})
export class MemberaddComponent implements OnInit, OnDestroy {
  meta:Meta;
  members = [];
  cluster_id;
  group_name;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute,private router:Router,private db: AngularFirestore,private authservice:AuthService) {
    
 }

  ngOnInit() {
      //Get the id url parameter which is the event id----------------------
      this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
        {
          let params  = p as param
          this.cluster_id=params.id;
          //Get Current user credentials---------------------------------------------
          this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
            this.meta = x;
        
            if(x){
           
                this.getCluster(params.id)              
          
            } 
          }) 
        }
        );
  }

  toggleRegistration(e,id){
    if(e.checked){
     
      this.add(id);
    }else{
    
      this.remove(id);
    }

  }

  add(id){
     this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+id).set({
       [this.cluster_id]:true
     }, { merge: true });
     //add new group to users groups
     this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+id+"/groups/"+this.cluster_id).set({
      group_id:this.cluster_id
    }, { merge: true });
   
  }

  remove(id){
    this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+id).set({
      [this.cluster_id]:false
    }, { merge: true })
    this.db.doc(this.meta.CHURCH_ID+'/membership/members/'+id+"/groups/"+this.cluster_id).delete();
  }

  getCluster(id){
      this.db.doc(this.meta.CHURCH_ID+'/membership/groups/'+id).valueChanges()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x=>{
         if(x){
          console.log(x['constraints']);
          if(x['parent_id']){
            this.getParentMembers(x['parent_id'],x['constraints'])
          }
         
          this.group_name = x['name'];
         }
      
      })
  }

  getParentMembers(parent_id,constraints){
    this.db.collection(this.meta.CHURCH_ID+"/membership/members/",ref=>ref.where(parent_id,'==',true))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
       let temp =[];
       x.forEach(a=>{
          const member = a.payload.doc.data() as member;
          const id = a.payload.doc.id;
          if(this.maritalStatusFilter(member.is_married,constraints['marital_status'])
          &&this.ageFilter(member.yob,constraints['min_age'],constraints['max_age'])
          &&this.genderFilter(member.gender,constraints['gender'])
          &&this.notMeFilter(id)){
            temp.push({
              id:id,
              name: member.name,
              joined:member[this.cluster_id]
            })
          }

       })
       this.members = []
       this.members = temp
    }
      

  
   );
  }
  maritalStatusFilter(marital_status,constraint){
      switch(marital_status){
        case true:
             if(constraint != 'single'){
               return true;
             }
             break;
        case false:
             if(constraint != 'married'){
              return true;
             }
             break;
      }
      return false;
  }

  ageFilter(yob,min_constraint,max_constraint){
    const yr:number = new Date().getFullYear();
    const age = yr-yob;
    const min = Number(min_constraint);
    const max = Number(max_constraint);
    
    //If there are no constraints
    if(min==0&&max==0){
      return true;
    }

    //If there is only minimum age constraint
    if(min>0 && max==0){
      if(age >= min){
        return true;
      }
      else{
        return false;
      }
    }

    //If there is only maximum age constraint
    if(min==0 && max>0){
      if(age<=max){
        return true;
      }
      else{
        return false;
      }
    }

    //If there is both minimum and maximum age constraints
    if(age>=min&&age<=max){
      return true;
    }
    else{
      return false;
    }

  }

 genderFilter(gender,constraint){
    switch(gender){
        case 'male':
            if(constraint != 'female'){
              return true;
            } 
            else{
              return false;
            } 
          
        case 'female':
            if(constraint != 'male'){
              return true;
            }
            else{
              return false;
            }
    }
    return true
 }
 notMeFilter(user_id){
    if(user_id==this.meta.USER_ID){
      return false
    }
    else{
      return true
    }
 }
 viewDetail(){
  this.router.navigate(["clusters/"+ this.cluster_id]);
 } 

 ngOnDestroy(){
  console.log('ngOnDestory');
  this.unsubscribe.next();
  this.unsubscribe.complete();
}
}
