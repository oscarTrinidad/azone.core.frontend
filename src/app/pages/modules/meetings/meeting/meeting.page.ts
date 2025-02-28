import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IMeetingInfo } from 'src/app/models/meetings/meetingInfo.interface';
import { MeetingInfoService } from 'src/app/services/modules/meetings/meetingInfo';
import { StorageService } from 'src/app/services/storages/storage.service';
import { UtilService } from 'src/app/services/tools/util.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
  standalone: false,
})
export class MeetingPage implements OnInit {
  @Input() emergent = false;
  @Input() seeMenus = true;
  componentName = "meeting.page.ts";
  aListMeeting: IMeetingInfo[] = [];
  aListMeetingFilter: IMeetingInfo[] = [];
  loader: any = null;
  subscription: Subscription | undefined;
  textFilter = '';

  constructor(
    private utilService: UtilService,
    private storageService: StorageService,
    private meetingInfoService: MeetingInfoService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.clearData();
    this.sendMenu();
    this.getLocal();
  }

  sendMenu() {
    this.utilService.sendMenu('meeting');
  }

  async getLocal() {
    // ASAMBLEAS
    const info = await this.storageService.getItem("MEETINGS");

    if (info) {
      this.aListMeeting = info;
      this.aListMeetingFilter = info;
    } else {
      this.getList();
    }
  }

  async getList() {
    this.loader = await this.loading('Obteniendo contratos...');
    await this.loader.present();

    const exec = await this.meetingInfoService.getList(this.componentName);

    this.subscription = exec.subscribe({
      next: async (result) => {
        if (result.success) {
          this.aListMeeting = result.list;
          this.aListMeetingFilter = result.list;
          console.log(result.list);
          await this.storageService.setItem("MEETINGS",result.list);
        } else {
          // this.presentToast(result.message, 'danger');
        }
        this.loader.dismiss();
      },
      error: (err) => {
        // console.log(err);
        this.presentToast('Error al obtener las asambleas.', 'danger');
        this.loader.dismiss();
      },
      complete: () => {
        this.loader.dismiss();
      }
    });

    // const meeting1 = {} as IMeetingInfo;
    // const meeting2 = {} as IMeetingInfo;

    // meeting1.dateReg = '2025-02-14';
    // meeting1.hourReg = '16:00';
    // meeting1.groupNumber = '002';
    // meeting1.feeNumber = 7;
    // meeting1.location = 'Asamblea Virtual';
    // meeting1.details = 'Asamblea Virtual';
    // meeting1.programName = 'PRO-48';

    // meeting2.dateReg = '2025-01-17';
    // meeting2.hourReg = '16:00';
    // meeting2.groupNumber = '002';
    // meeting2.feeNumber = 6;
    // meeting2.location = 'Asamblea Virtual';
    // meeting2.details = 'Asamblea Virtual';
    // meeting2.programName = 'PRO-48';
  }

  clearData(){
    this.textFilter = '';
    this.aListMeeting = [];
    this.aListMeetingFilter = [];
  }

  updateFilter(event: any) {
    const searchValue = event.target.value.toLowerCase();
  
    // Filtra la lista basándose en el valor ingresado en el input
    this.aListMeetingFilter = this.aListMeeting.filter(item => {
      return (
        item.dateReg.toString().toLowerCase().includes(searchValue) ||
        item.groupCode.toString().toLowerCase().includes(searchValue) ||
        item.feeNumber.toString().toLowerCase().includes(searchValue) ||
        item.programName.toString().toLowerCase().includes(searchValue)
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
