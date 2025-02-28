import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IContract } from 'src/app/models/modules/contracts/contract.interface';
import { AuthService } from 'src/app/services/auths/auth.service';
import { ContractService } from 'src/app/services/modules/contracts/contract.service';
import { StorageService } from 'src/app/services/storages/storage.service';
import { UtilService } from 'src/app/services/tools/util.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
  standalone: false,
})
export class ContractPage implements OnInit {
  @Input() emergent = false;
  @Input() seeMenus = true;
  componentName = "contract.page.ts";
  aListContract: IContract[] = [];
  aListContractFilter: IContract[] = [];
  loader: any = null;
  username = '0'; 
  subscription: Subscription | undefined;
  textFilter = '';

  constructor(
    private utilService: UtilService,
    private storageService: StorageService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private contractService: ContractService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.clearData();
    this.sendMenu();
    this.getLocal();
  }

  sendMenu() {
    this.utilService.sendMenu('contract');
  }

  async getLocal() {
    // USUARIO
    const username = await this.storageService.getItem("USERNAME");
    if(username){
      this.username = username;
    } else {
      this.username = '0';
    }

    // CONTRATOS
    const info = await this.storageService.getItem("CONTRACTS");

    if (info) {
      this.aListContract = info;
      this.aListContractFilter = info;
    } else {
      this.getList();
    }
  }

  async getList() {
    this.loader = await this.loading('Obteniendo contratos...');
    await this.loader.present();

    const form = {} as IContract;
    form.associatedNumber = this.username;
    form.programHash = '';
    form.groupHash = '';
    form.positionHash = '';
    form.certificateHash = '';
    form.profileHash = '';
    form.associatedDocumentTypeHash = '';
    form.number = '';
    form.displayName = '';
    form.glcHash = '';

    const exec = await this.contractService.getSearch(this.componentName,form);

    this.subscription = exec.subscribe({
      next: async (result) => {
        if (result.typeResponseCode != 2) {
          this.presentToast(result.message, 'danger');
        } else {
          this.aListContract = result.list;
          this.aListContractFilter = result.list;
          console.log(result.list);
          await this.storageService.setItem("CONTRACTS",result.list);
        }
        this.loader.dismiss();
      },
      error: (err) => {
        // console.log(err);
        this.presentToast('Error al obtener los contratos.', 'danger');
        this.loader.dismiss();
      },
      complete: () => {
        this.loader.dismiss();
      }
    });
  }

  clearData(){
    this.textFilter = '';
    this.username = '0';
    this.aListContract = [];
    this.aListContractFilter = [];
  }

  updateFilter(event: any) {
    const searchValue = event.target.value.toLowerCase();
  
    // Filtra la lista basándose en el valor ingresado en el input
    this.aListContractFilter = this.aListContract.filter(item => {
      return (
        item.number.toString().toLowerCase().includes(searchValue) ||
        item.contractStatusName.toString().toLowerCase().includes(searchValue) ||
        item.certificateAmount.toString().toLowerCase().includes(searchValue) ||
        item.positionDisplayName.toString().toLowerCase().includes(searchValue)
      );
    });
  }


  ouputEvents(event: any) {
    if (event === 'refresh') {
      this.textFilter = '';
      this.getList();
    }
  }

  async loading(mensaje: string = 'Consultando...') {
    const loader = await this.loadingCtrl.create({
      message: mensaje
    });
    return loader;
  }

  async presentToast(pMessage: string, pColor: string = 'success', pDuration: number = 2000) {
    const toast = await this.toastController.create({
      message: pMessage,
      duration: pDuration,
      position: 'bottom', // Puedes cambiar la posición: 'top', 'bottom', 'middle'
      color: pColor, // Color del toast
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            console.log('Toast cerrado');
          },
        },
      ],
    });
    await toast.present();
  }

}
