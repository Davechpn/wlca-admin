import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent }from './App-Shared/layout/layout.component'
import { LoginComponent} from './App-Shared/login/login.component'
import { UnauthorizedComponent} from './App-Shared/unauthorized/unauthorized.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  }, 
  {
    path: 'register',
    component: UnauthorizedComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
        {
          path: '',
          loadChildren: './App-Dashboard/dashboard/dashboard.module#DashboardModule'
        },
        {
          path: 'clusters',
          loadChildren: './App-Clusters/clusters/clusters.module#ClustersModule'
        },
        {
          path: 'clusters',
          loadChildren: './App-Clusters/clustercreate/clustercreate.module#ClustercreateModule'
        },
        {
          path: 'clusters',
          loadChildren: './App-Clusters/clusterdetails/clusterdetails.module#ClusterdetailsModule'
        },
        {
          path: 'clusters',
          loadChildren: './App-Members/memberadd/memberadd.module#MemberaddModule'
        },
        {
          path: 'members',
          loadChildren: './App-Members/membercreate/membercreate.module#MembercreateModule'
        },
        {
          path: 'members',
          loadChildren: './App-Members/memberdetails/memberdetails.module#MemberdetailsModule'
        },
        {
          path: 'word',
          loadChildren: './App-Word/word/word.module#wordModule'
        },
        {
          path: 'word',
          loadChildren: './App-Word/wordcreate/wordcreate.module#wordcreateModule'
        },
        {
          path: 'word',
          loadChildren: './App-Word/worddetails/worddetails.module#worddetailsModule'
        },        
        {
          path: 'events',
          loadChildren: './App-Events/events/events.module#EventsModule'
        },
        {
          path: 'events',
          loadChildren: './App-Events/eventcreate/eventcreate.module#EventcreateModule'
        },
        {
          path: 'events',
          loadChildren: './App-Events/eventdetails/eventdetails.module#EventdetailsModule'
        },
        {
          path: 'notices',
          loadChildren: './App-Notices/notices/notices.module#NoticesModule'
        },
        {
          path: 'notices',
          loadChildren: './App-Notices/noticecreate/noticecreate.module#NoticecreateModule'
        },
        {
          path: 'notices',
          loadChildren: './App-Notices/noticedetails/noticedetails.module#NoticedetailsModule'
        },
        {
          path: 'expenditure',
          loadChildren: './App-Expenditure/expenditure/expenditure.module#ExpenditureModule'
        },
        {
          path: 'expenditure',
          loadChildren: './App-Expenditure/expenditurecreate/expenditurecreate.module#ExpenditurecreateModule'
        },
        {
          path: 'expenditure',
          loadChildren: './App-Expenditure/expendituredetails/expendituredetails.module#ExpendituredetailsModule'
        },
        {
          path: 'fundraising',
          loadChildren: './App-Fundraising/fundraising/fundraising.module#FundraisingModule'
        },
        {
          path: 'fundraising',
          loadChildren: './App-Fundraising/fundraisingcreate/fundraisingcreate.module#FundraisingcreateModule'
        },
        {
          path: 'fundraising',
          loadChildren: './App-Fundraising/fundraisingdetails/fundraisingdetails.module#FundraisingdetailsModule'
        },
        {
          path: 'fundraising',
          loadChildren: './App-Receipts/receiptadd/receiptadd.module#ReceiptaddModule'
        },
        {
          path: 'fundraising',
          loadChildren: './App-Receipts/paypledge/paypledge.module#PaypledgeModule'
        },
     
    
   
]} 
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
