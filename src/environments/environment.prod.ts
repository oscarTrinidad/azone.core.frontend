export const environment = {
  production: true,
  sitename: 'Producción', //Producción | Pruebas
  url_api: {
    //#region PRD
    general: 'https://bsapprdcoreapi.proponte.com.pe/api/',
    report: 'https://bsapprdcoreapi.proponte.com.pe/api/'
    //#endregion

   //#region TEST
    //  general: 'https://localhost:5001/api/',
    //  report: 'https://localhost:5001/api/'
  // general: 'https://bsapqacoreapi.proponte.com.pe/api/',
  // report: 'https://bsapqacoreapi.proponte.com.pe/api/'
   //#endregion
  },
  rapidapi:{
    secret: '5METHAGU3VCKLUA4',
    key: '55e8493b27msh08b0bbac98b4a72p1d9bc4jsn0030754910f8',
    host:{
      authenticator: 'easy-authenticator.p.rapidapi.com'
    }
  }
};
