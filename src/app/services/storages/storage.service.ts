import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initialize();
    // this.init();
  }

  private async initialize() {
    await this.init();
  }

  async init() {
    const storage = await this.storage.create();
    // console.log(storage);
    this._storage = storage;
  }

  async setItem(key: string, oParam: any){

    await this.init(); 
    await this._storage?.set(key, oParam);

  }

  async getItem(key: string){
    await this.init(); 
    return await this._storage?.get(key);

  }

  async removeItem(key: string){

    await this.init(); 
    await this._storage?.remove(key);

  }

  async clearData(){
    
    await this.init(); 
    await this._storage?.clear();
  }

}