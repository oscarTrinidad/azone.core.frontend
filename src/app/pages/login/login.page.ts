import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { IAuth } from 'src/app/models/auths/auth.interface';
import { IToken } from 'src/app/models/auths/tokens.interface';
import { IUser } from 'src/app/models/users/user.interface';
import { AuthService } from 'src/app/services/auths/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  formGroup: FormGroup;
  formGroup2: FormGroup;
  today: string | null | undefined;
  bUpdate = false;
  errorPassword = {} as IAuth;
  dataToken = {} as IToken;
  showP = false;
  showP2 = false;
  showP3 = false;
  loader: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
  ) {
    this.formGroup = this.formBuilder.group({
      username: new FormControl(''),
      password: new FormControl('')
    });

    this.formGroup2 = this.formBuilder.group({
      username: new FormControl(''), 
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
    });

    this.createformGroup();
    this.generateError();
  }

  ngOnInit() {
  }

  ionViewWillLeave(){
    this.goBack();
  }

  createformGroup() {
    this.formGroup = this.formBuilder.group({
      username: new FormControl(''),
      password: new FormControl('')
    });

    this.formGroup2 = this.formBuilder.group({
      username: new FormControl(''), 
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
    });
  }

  generateError() {
    this.errorPassword.password = '';
    this.errorPassword.repeatPassword = '';
  }

  async onLogin() {
    if(this.formGroup){
      const form: IAuth = this.formGroup.getRawValue();

      if(form.username === '' || form.password === ''){
        this.presentToast('Ingrese el usuario y contraseña.','danger');
        return;
      }

      this.loader = await this.loading('Validando credenciales...');
      await this.loader.present();

      this.authService.login(form).subscribe({
        next: async (result) => {
          // console.log('result:',result);
          if (result.jwtToken != '0') {
            this.dataToken = result;
            if(!result.userAzone.repeat){
              this.bUpdate = true;
              this.loader.dismiss();
            } else {
              this.authService.doLoginUser(this.dataToken);
              setTimeout(() => {
                this.router.navigate(['/home']);
                this.loader.dismiss();
              }, 500);
            }
          } else {
            this.presentToast(result.message,'danger');
            this.loader.dismiss();
          }
        },
        error: (err) => {
          // console.log(err);
          this.presentToast('Error al iniciar sesión.','danger');
          this.loader.dismiss();
        },
        complete: () => {
        }
      });

      // if (form.username === 'admin' && form.password === 'admin123') {
      //   const repeat = true;
      //   const tokenData = {} as IToken;
      //   tokenData.userAzone = {} as IUser;
      //   tokenData.userAzone.username = form.username;
      //   tokenData.userAzone.password = form.password;
      //   this.dataToken = tokenData;

      //   if(repeat){
      //     this.bUpdate = true;
      //   } else {
      //     this.authService.doLoginUser(this.dataToken);
      //     //localStorage.setItem('user', '');
      //     this.router.navigate(['/home']);
      //   }
      // } else {
      //   // alert('Usuario o contraseña incorrectos');
      //   this.presentToast('Usuario o contraseña incorrectos','danger');
      // }
    }
  }

  goBack(){
    this.bUpdate = false;
    this.showP = false;
    this.showP2 = false;
    this.showP3 = false;

    this.formGroup.patchValue({
      username: '',
      password: ''
    });
    this.formGroup2.patchValue({
      username: '', 
      password: '',
      repeatPassword: ''
    });

    this.generateError();
  }

  async proceedLogin(){
    this.generateError();
    const form: IAuth = this.formGroup2.getRawValue();
    let error = 0;

    if(form.password !== form.repeatPassword && form.password !== '' && form.repeatPassword !== ''){
      this.errorPassword.password = 'Contraseña diferente';
      this.errorPassword.repeatPassword = 'Contraseña diferente';
      error ++;
    } else if(form.password === ''){
      this.errorPassword.password = 'Definir nueva contraseña';
      error ++;
    } else if(form.repeatPassword === ''){
      this.errorPassword.repeatPassword = 'Definir otra vez la nueva contraseña';
      error ++;
    }

    if(error > 0){
      return;
    }

    form.username = this.dataToken.userAzone.hash;

    this.loader = await this.loading('Actualizando contraseñas...');
    await this.loader.present();

    this.authService.changePassword(form).subscribe({
      next: async (result) => {
        // console.log('result:',result);
        if (result.success) {
          this.loader.dismiss();
          this.authService.doLoginUser(this.dataToken);
          setTimeout(() => {
            this.router.navigate(['/home']);
            this.loader.dismiss();
          }, 500);
        } else {
          this.presentToast(result.message,'danger');
          this.loader.dismiss();
        }
      },
      error: (err) => {
        // console.log(err);
        this.presentToast('Error al cambiar de contraseña.','danger');
        this.loader.dismiss();
      },
      complete: () => {
        this.loader.dismiss();
      }
    });
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

  get e() {
    return this.errorPassword;
  }

  async loading(mensaje: string = 'Consultando...') {
    const loader = await this.loadingCtrl.create({
      message: mensaje
    });
    return loader;
  }


}
