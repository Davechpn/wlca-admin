import { Component, OnInit,OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService, Meta } from '../../Shared-Services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router} from "@angular/router";
import { map, filter, distinct ,pluck} from 'rxjs/operators';
import { Subject}from'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

interface child{
  group_id:string,
  group_name:string,
  men:number,
  women:number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
 
  meta:Meta;

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
 // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [];

  bars_loaded = false;

  public pieChartLabels: Label[] = ['below 18 yrs', '18 to 29 yrs', '30 to 49 yrs','over 50 yrs'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
 //public pieChartPlugins = [pluginDataLabels];
 //danc
 // backgroundColor: ['rgba(244,67,54 ,1)', 'rgba(76,175,80 ,1)', 'rgba(253,216,53 ,1)','rgba(63,81,181 ,1)','rgba(159, 90, 253,1)'],
 //rwg
 // backgroundColor: ['rgba(255,0,0,1)', 'rgba(0,255,0,1)', 'rgba(249, 180, 45,1)','rgba(150, 54, 148,1)','rgba(159, 90, 253,1)'],
  public pieChartColors = [
    {
      backgroundColor: ['rgba(244,67,54 ,1)', 'rgba(76,175,80 ,1)', 'rgba(253,216,53 ,1)','rgba(63,81,181 ,1)','rgba(159, 90, 253,1)']
    },
  ];

  //counts
  all_members;
  male;
  female;

  men;
  women;


  below_18;
  eightteento29;
  thirtyto49;
  fiftyandabove;

  username;
  rolename;
  ranclusters:boolean = false;

  clusters_data_table = [];
  public columnChartData;
  //public pieChartData;
  private unsubscribe: Subject<void> = new Subject();
  constructor(private db: AngularFirestore,private authservice:AuthService,private angularFireAuth:AngularFireAuth,private router:Router) {
  }



  ngOnInit() {
    //Get Current user credentials---------------------------------------------
    this.authservice.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(x=>{
        this.meta = x;
        if(x){
          this.username = this.meta.AUTHOR_NAME;
          this.rolename = this.meta.ROLE;
          //Get values for statistical graphs
          this.getCount();
          this.getAgesDemographic();
          this.getClustering();

        } 
    })    
  }




  getCount(){
   let that = this;
   this.db.collection(this.meta.CHURCH_ID+"/membership/members/", ref=> ref.where(this.meta.GROUP_ID,'==',true))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => {      
         that.all_members = x.length
     
   });
   this.db.collection(this.meta.CHURCH_ID+"/membership/members/",ref=>ref.where(this.meta.GROUP_ID,'==',true).where('gender','==','male'))
   .snapshotChanges()
   .pipe(takeUntil(this.unsubscribe))
   .subscribe(x => {      
         that.male = x.length

    
   });
   this.db.collection(this.meta.CHURCH_ID+"/membership/members/",ref=>ref.where(this.meta.GROUP_ID,'==',true).where('gender','==','female'))
   .snapshotChanges()
   .pipe(takeUntil(this.unsubscribe))
   .subscribe(x => {      
         that.female = x.length
   });


  }
  getAgesDemographic(){
    //get all people in my group
    let that = this
    this.db.collection(this.meta.CHURCH_ID+'/membership/members/', ref=> ref.where(this.meta.GROUP_ID,'==',true))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x => { 
             that.below_18  = 0;
             that.eightteento29 = 0;
             that.thirtyto49 = 0;
             that.fiftyandabove = 0; 
          
             x.forEach(y=>{
               let z = y.payload.doc.data();
               let ag =  new Date().getFullYear()-z["yob"];
            
               switch (true) {
                   case (ag < 18):
                        that.below_18++
                   break;
                   case ( ag < 30 && ag > 17):
                        that.eightteento29++                   
                   break;
                   case (ag < 50 && ag > 29):
                        that.thirtyto49++
                   break;
                   case (ag > 49 ):
                        that.fiftyandabove++
                   break;
               
                 default:
                   break;
               }
             })
             this.authservice.updateLoadedState(true);
          //  this.redrawPie();
         this.pieChartData = [this.below_18, this.eightteento29, this.thirtyto49,this.fiftyandabove];
          
    });

  }

  getClustering(){
    let children:child[] = [];
    this.db.collection(this.meta.CHURCH_ID+"/membership/groups/",ref => ref.where('parent_id','==',this.meta.GROUP_ID))
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(x=>{
       x.forEach(c=>{
         children.push({
           group_id:c.payload.doc.id,
           group_name:c.payload.doc.data()['name'],
           men:0,
           women:0
         })
       })
       this.getMembership(children)
    })
  }
  getMembership(children:child[]){
    let that = this;

    //get all members and filter with thier existance in a group 
    //distribute countings
    this.db.collection(this.meta.CHURCH_ID+"/membership/members/")
    .snapshotChanges()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(ms => {  
      //reset all counts
      children.forEach(c=>{
        c.men = 0;
        c.women = 0;
      })

      let temp_group_label = [];
      let temp_men_count = [];
      let temp_women_count = [];
      
      ms.forEach(m=>{
        //all members loop
        children.forEach(c=>{
          //looping through groups droping a member if is in group
           if(m.payload.doc.data()[c.group_id]==true){
             //drop counts
             if(m.payload.doc.data()['gender']=='male'){
               //increament child's men
               c.men++
             }
             if(m.payload.doc.data()['gender']=='female'){
              //increament child's women
              c.women++
            }
           }
        })
      })  

     
      children.forEach(c=>{
        if(c.men>0||c.women>0){
          temp_group_label.push( c.group_name);
          temp_men_count.push(c.men);
          temp_women_count.push(c.women);
        }
       
      })
      this.barChartLabels = temp_group_label;
      this.barChartData = [
        { data: temp_men_count, label: 'Men' , backgroundColor:'rgba(244,67,54 ,1)'},
        { data: temp_women_count, label: 'Women', backgroundColor:'rgba(63,81,181 ,1)' }
      ];
      this.bars_loaded = true;
    
    });
  

  }

  public barChartOptions: ChartOptions = {
    responsive: false,
    
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero:true,
              stepSize: 1
          }
      }]
  },
    legend: {
      position: 'bottom',
    },
    // We use these empty structures as placeholders for dynamic theming.

    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  // events
 

  //Pie Chat sect

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };





  
  signOut(){
    
    this.angularFireAuth.auth.signOut();
  }
  ngOnDestroy(){
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
