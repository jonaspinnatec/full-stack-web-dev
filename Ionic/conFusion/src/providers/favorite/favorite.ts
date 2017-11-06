import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export class FavoriteProvider {

  favorites: Array<any>;

  // constructor(public http: Http) {
  constructor() {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
  }

  addFavorite(id: number): boolean {
    this.favorites.push(id);
    return true;
  };

  isFavorite(id: number): boolean {
    return this.favorites.some(el => el === id);
  };
}
