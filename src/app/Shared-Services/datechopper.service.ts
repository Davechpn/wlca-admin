import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DatechopperService {

  constructor() { }
  getDate(date){
    let dt = date.split("-")
    return dt[2];
  }
  getMonth(date){
    let dt = date.split("-")
    let months:string[] = ["Zero","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let m = parseInt(dt[1], 10);
    return months[m];
  }
  getYear(date){
    let dt = date.split("-")
    return dt[0];
  }

  getTimestamp(){
   return new Date().getTime() / 1000
  }

  getDateNow():string{
     let m = new Date().getMonth() + 1;
     let d = new Date().getDate();
     const year = new Date().getFullYear();
     let month:string="";
     let date;
     if(m<10){
       month = "0"+m;
     }
     else{
       month = ""+m
     }
     if(d<10){
        date = "0"+d;
      }
      else{
        date = ""+d
      }

     return(`${year}-${month}-${date}`);
  }

  getDateFromMaterialDate(date):string {
    let str = date+"";
    let dt = str.split(" ");

    let dat = dt[2]
    let month = dt[1];
    let year = dt[3];

    switch(month){
      case "Jan":
          month = "01";
          break;

      case "Feb":
          month = "02";
          break;

      case "Mar":
          month = "03";
          break;

      case "Apr":
          month = "04";
          break;

      case "May":
          month = "05";
          break;

      case "Jun":
          month = "06";
          break;

      case "Jul":
          month = "07";
          break; 

      case "Aug":
          month = "08";
          break;

      case "Sep":
          month = "09";
          break;

      case "Oct":
          month = "10";
          break;
      case "Nov":
          month = "11";
          break;
      case "Dec":
          month = "12";
          break;

    }
    return `${year}-${month}-${dat}`;

  }
}
