export const environment = {
  production: true,
   //apiUrl: 'https://videture77hotwebapi.azurewebsites.net/api/', // change this URL as production API url,
  apiUrl: 'https://videturprotstbe.azurewebsites.net/api/', // change this URL as production API url,
  //apiUrl: 'http://localhost:21897/api/',
  feature: {
    Idle: {
      enable: true,
      idleTimeSeconds: 1200, // In future we will pick this from DB which will set from Admin module
      timeOutSeconds: 1
    }
  }
};
