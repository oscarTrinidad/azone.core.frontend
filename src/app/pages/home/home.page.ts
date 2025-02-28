import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IMenu, IModule } from 'src/app/models/modules/module.interface';
import { AuthService } from 'src/app/services/auths/auth.service';
import { StorageService } from "src/app/services/storages/storage.service";
import { UtilService } from 'src/app/services/tools/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  
  @Input() emergent = false;
  @Input() seeMenus = false;
  @Input() logOut = 1;

  aListModuleGlobal: IMenu[] = [];
  subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.getList();
    this.local();
  }

  async local(){
    const info = await this.storageService.getItem("JWT_USER_INFO")
    // console.log('info', info);
  }

  ionViewWillEnter(){
    this.sendMenu();
  }

  getList(){
    this.aListModuleGlobal = [
      {
        idMenu: 1,
        name: 'CONTRATOS',
        icon: 'newspaper-outline',
        image: '',
        srcImage: '../../../assets/img/modules/contracts/contract-bg.jpg',
        route: 'contract'
      },
      {
        idMenu: 2,
        name: 'ASAMBLEAS',
        icon: 'today-outline',
        image: '',
        srcImage: '../../../assets/img/modules/meetings/meeting-bg.jpg',
        route: 'meeting'
      }
    ];
  }

  sendMenu() {
    this.utilService.sendMenu('home');
  }

  async openRoute(nameRoute?: string){
    if(nameRoute){
      this.router.navigate(['/'+nameRoute]);
      if(this.emergent){
        await this.modalCtrl.dismiss();
      }
    }
  }

  async loading(message: string = 'Consultando...') {
    const loading = await this.loadingCtrl.create({
      message: message
    });
    return loading;
  }

  async mostrarToast(pMessage: string, pColor: string, pIcon: string, pTime: number = 3000){
    const toast = await this.toastCtrl.create({
      message: pMessage,
      duration: pTime,
      color: pColor,
      icon: pIcon,
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          handler: () => {
            //console.log('Tostada cerrada');
          },
        },
      ],
    });
    await toast.present();
  }

  ouputEvents(event: any){
    if(event === 'refresh'){
    }
  }

}
