import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppTranslationModule } from '../../app.translation.module';

import { routing } from './media.routing';
import { Media } from './media.component';
import { Upload } from './components/upload/Upload.component';
import { ModalComponent } from './components/modal/modal.component';
import { ChildTable } from './components/childTable/childTable.component';
import { Default } from './default';
import { MediaService } from './media.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing
  ],
  declarations: [
    Media,
    Upload,
    Default,
    ModalComponent,
    ChildTable

  ],
  providers: [
    MediaService
  ],
  entryComponents: [
    ModalComponent
  ]

})
export class MediaModule { }
