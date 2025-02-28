import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractPageRoutingModule } from './contract-routing.module';

import { ContractPage } from './contract.page';

import { ComponentModule } from '../../../../components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractPageRoutingModule,
    ComponentModule
  ],
  declarations: [ContractPage]
})
export class ContractPageModule {}
