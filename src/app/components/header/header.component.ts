import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/users/user.interface';
import { HomePage } from 'src/app/pages/home/home.page';
import { StorageService } from 'src/app/services/storages/storage.service';
import { UtilService } from 'src/app/services/tools/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {
  @Input() tittle = '';
  @Input() icon = ''; // logo-capacitor
  @Input() seeMenus = false;
  @Input() emergent = false;
  @Input() refresh = false;
  @Input() seeSubMenu = '';
  @Input() logOut = 0; // cerrrarSesion
  @Input() moduleId = 'home';
  
  @Output() exit = new EventEmitter<any>();
  subscription?: Subscription;

  dataUser = {} as IUser;
  
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private storageService: StorageService,
    private navCtrl: NavController,
    private utilService: UtilService,
  ) {
    this.subscription = this.utilService.menuObservable.subscribe((id) => {
      this.getLocal();
      if(id!==''){
        this.moduleId = id;
      } else {
        this.moduleId = 'home';
      }
    });
  }

  ngOnInit() {
    this.getLocal();
  }

  ionViewWillEnter(){
    // this.getLocal();
  }

  ionViewWillLeave(){
    // if(this.subscription){
    //   this.subscription.unsubscribe();
    // }
  }

  async getLocal(){
    const info = await this.storageService.getItem("JWT_USER_INFO");
    // console.log('info', info);
    if(info){
      this.dataUser = info;
    } else {
      this.dataUser.documentName = '';
      this.dataUser.number = 'USUARIO';
      this.dataUser.typeName = 'ASOCIADO';
      this.dataUser.fullName = 'ASOCIADO';
    }
  }

  async modalMenus(){
    // this.modal = true;
    const modal = await this.modalCtrl.create({
      component: HomePage,
      componentProps: {
        emergent: true,
        seeMenus: false,
        logOut: 0
      },
      cssClass: 'md-modal'
    });
    modal.present();
  }

  async closedSession(){

    const alert = await this.alertCtrl.create({
      header: 'A-ZONE',
      message: 'Seguro desea cerrar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // console.log('Alert canceled'); 
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
            // console.log('Alert confirmed');
            //await this.storageService.clearItem('user');
            this.storageService.clearData();
            this.router.navigateByUrl('/login');
          },
        },
      ],
    });

    await alert.present();

  }

  home(){
    this.router.navigateByUrl('/home');
  }

  async closeModal(){
    await this.modalCtrl.dismiss(false);
  }

  async exitEvents(event: any){
    this.exit.emit(event);
  }


}
