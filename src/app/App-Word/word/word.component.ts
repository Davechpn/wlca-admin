import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService, Meta} from '../../Shared-Services/auth.service';
import { Router} from "@angular/router";
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Word{
  title:string
  created_date:number,
  month:string,
  date:string,
  group_id:string,
  group_name:string,
  timestamp:number,
  is_sent:boolean,
  unRead:boolean
}

interface wordId extends Word{
  id:string
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class wordComponent implements OnInit, OnDestroy {
  meta;
  permissions;
  view_settings;
  reads = [];
  word: wordId[] = [];
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService, private router :Router, private dc:DatechopperService) {
  }

  ngOnInit() {

   this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
    this.meta = x;
    if(x){
      this.authservice.readMessages.pipe(takeUntil(this.unsubscribe)).subscribe(r=>{
        this.reads = r;
        this.authservice.permissions.pipe(takeUntil(this.unsubscribe)).subscribe(p=>{
          this.permissions = p;
          this.authservice.viewSettings.pipe(takeUntil(this.unsubscribe)).subscribe(v=>{
            this.view_settings = v;
            
            if(v){
              if(v['word'])
              {
                this.getAll();
              }
              else{
                this.getMine();
              }
            }
          })
        })
      
      })
    } 
   }) 
  }

  toggleGet(e){
    if(e.checked){
      this.getAll();
    
      this.authservice.setSettings(this.meta.USER_ID,'switch','word',true); 
    }
    else{
      this.getMine();

      this.authservice.setSettings(this.meta.USER_ID,'switch','word',false);     
    }
  }


  getMine(){
        //create a looping list and append to html for each fetch
        this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('message_type','==','word')).snapshotChanges()
        .pipe(takeUntil(this.unsubscribe)).subscribe(
        (x)=>
         {
           let temp=[];
           x.forEach((y)=> {          
            let z = y.payload.doc.data() as Word;
            const id = y.payload.doc.id;
            if(this.isMine(z.group_id)){
              temp.push( 
                {
                  id:id,
                  title:z.title,
                  date:this.dc.getDate(z.created_date),
                  month:this.dc.getMonth(z.created_date),
                  created_date:z.created_date,
                  group_id:z.group_id,
                  group_name:z.group_name,
                  timestamp:z.timestamp,
                  is_sent:z.is_sent,
                  unRead:this.unReadTag(id)
                });
            }
          
        
          })
           this.word = []
           this.word = this.timestampSort(temp);
          })
         }
     
   getAll(){
    this.db.collection(this.meta.CHURCH_ID+'/cms/messages',ref => ref.where('inherited', 'array-contains', this.meta.GROUP_ID).where('message_type','==','word'))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
      let temp = [];
      x.forEach((y)=> {         
        let z = y.payload.doc.data() as Word;
        const id = y.payload.doc.id;
        temp.push( 
          {
            id:id,
            title:z.title,
            date:this.dc.getDate(z.created_date),
            month:this.dc.getMonth(z.created_date),
            created_date:z.created_date,
            group_id:z.group_id,
            group_name:z.group_name,
            timestamp:z.timestamp,
            is_sent:z.is_sent
          });   
      })
      this.word = []
      this.word = this.timestampSort(temp);
    })

   }
    
  timestampSort(items){
        items.sort(function(a, b) { 
          return b.timestamp- a.timestamp;
          })
       
        return items;
      }
  
  viewDetail(id){
    this.router.navigate(["word/"+ id]);
  }
  
  isMine(group_id):boolean{
    if (  this.meta.SPACE.indexOf(group_id) > -1 ) {
      return true
    } 
    else {
      return false
    }
  }
  unReadTag(id:string){
    if ( this.reads.indexOf(id) > -1 ) {
       //when document is already read
       return false
    } else {
      //when document not read
      return true
    }
  }

  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
