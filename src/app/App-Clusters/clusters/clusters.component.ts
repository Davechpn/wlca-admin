import { Component, OnInit ,OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router} from "@angular/router";
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface clusterData{
  members_count:number,
  name:string,
  cell:string,
  is_sent:boolean
}
interface cluster extends clusterData
{
  id:string
}

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.css']
})
export class ClustersComponent implements OnInit ,OnDestroy{
  meta:Meta;
  my_group_Id;
  role;
  permissions;
  view_settings;
  clusters: Observable<cluster[]>;
  myCluster: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private router:Router, private authservice:AuthService) {
  }

  ngOnInit() {
    //Get Current user credentials----------------------------
    this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      this.meta = x;
      if(x){
        this.authservice.permissions.pipe(takeUntil(this.unsubscribe)).subscribe(p=>{
          this.permissions = p;
          this.authservice.viewSettings.pipe(takeUntil(this.unsubscribe)).subscribe(v=>{
            this.view_settings = v;
           
            if(v){
              if(v['clusters'])
              {
                this.getAll();
              }
              else{                
                //Initial fetch of clusters-----------
                this.getMine();
                this.getImmediate();
              }
            }
          })
        
          this.my_group_Id = this.meta.GROUP_ID;
        })
      
         
      } 
  })   
  }

  viewDetail(id){
    
    this.router.navigate(["clusters/"+ id]);
  }

  toggleGet(e){
     if(e.checked){
      this.authservice.setSettings(this.meta.USER_ID,'switch','clusters',true);
     }
     else{
       this.authservice.setSettings(this.meta.USER_ID,'switch','clusters',false);
     }

  }

  getMine(){
    
    this.myCluster = this.db.doc(this.meta.CHURCH_ID+'/membership/groups/'+this.meta.GROUP_ID+'/').valueChanges()
  }

  getImmediate(){
    //Query using parent_id which is this group_id to get immediate clusters
    this.clusters = this.db.collection(this.meta.CHURCH_ID+'/membership/groups/',ref => ref.where('parent_id', '==', this.meta.GROUP_ID) )
    .snapshotChanges().pipe(
      takeUntil(this.unsubscribe),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as clusterData;
        const id = a.payload.doc.id;
        return { "id":id,"name": data.name,"cell":data.cell,"members_count":data.members_count,"is_sent":data.is_sent };
      }))
    );
  }

  getAll(){
    this.clusters = this.db.collection(this.meta.CHURCH_ID+'/membership/groups/',ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID) ).snapshotChanges()
    .pipe(
      takeUntil(this.unsubscribe),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as clusterData;
        const id = a.payload.doc.id;
        return { "id":id,"name": data.name,"cell":data.cell,"members_count":data.members_count,"is_sent":data.is_sent };
      }))
    );
   
  }

  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
    
  }

}
