import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppTranslationModule } from '../../app.translation.module';

import { routing } from './reports.routing';
import { Reports } from './reports.component';
import {ModalComponent } from './components/modal/modal.component';
import {ChildTable } from './components/childTable/childTable.component';
import{MasterTable} from './components/masterTable/masterTable.component'
import{ReportsService} from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing
  ],
  declarations: [
    
    Reports,
    ModalComponent,
    ChildTable,
    MasterTable
  ],
  providers: [
    ReportsService
  ],
  entryComponents: [
    ModalComponent
   ]
})
export class ReportsModule {}
