import { Routes, RouterModule }  from '@angular/router';


import{Reports} from './reports.component';
import{ChildTable} from './components/childTable/childTable.component';
import{MasterTable} from './components/masterTable/masterTable.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Reports, 
    children: [
      { path: '', component: MasterTable},
      { path: 'table', component: ChildTable}     
    ]  
  }
];
export const routing = RouterModule.forChild(routes);
