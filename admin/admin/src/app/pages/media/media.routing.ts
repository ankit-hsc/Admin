import { Routes, RouterModule } from '@angular/router';

import { Media } from './media.component';
import { Upload } from './components/upload/Upload.component';
import { Default } from './default';
import { ChildTable } from './components/childTable/childTable.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Media,
    children: [
      { path: 'upload', component: Upload },
      { path: 'table', component: ChildTable }
      // { path: 'archived', component: Default },
      // { path: 'deleted', component: Default }

    ]
  }
];
export const routing = RouterModule.forChild(routes);
