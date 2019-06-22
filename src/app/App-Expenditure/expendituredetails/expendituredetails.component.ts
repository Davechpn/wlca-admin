import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService,Meta } from '../../Shared-Services/auth.service';
import { Observable } from 'rxjs';
import { DatechopperService } from '../../Shared-Services/datechopper.service';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

interface param{
  id:string
}


@Component({
  selector: 'app-expendituredetails',
  templateUrl: './expendituredetails.component.html',
  styleUrls: ['./expendituredetails.component.css']
})
export class ExpendituredetailsComponent implements OnInit,OnDestroy {
  meta:Meta;
  date;
  year;
  expenditure: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private route: ActivatedRoute, private dc:DatechopperService,private authservice:AuthService,private db: AngularFirestore) {
    
   }

  ngOnInit() {
    //Get the id url parameter which is the expenditure id----------------------
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe( p => 
      {
        let params  = p as param
        
        //Get Current user credentials---------------------------------------------
        this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
          this.meta = x;
          if(x){
            //Initial fetch of expenditure--------
            this.getDetail(params.id)
            
          } 
        }) 
      }
      );
  }
  
  getDetail(id){
    //We already have expenditure id so we use valueChanges()
    this.expenditure = this.db.doc(this.meta.CHURCH_ID+'/funds/receipts/'+id+'/').valueChanges();
    this.expenditure.pipe(takeUntil(this.unsubscribe)).subscribe(
      x=>{
        this.date = this.dc.getDate(x['date'])+" " + this.dc.getMonth(x['date']);
        this.year = this.dc.getYear(x['date']);
      }
    )
  }

  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
