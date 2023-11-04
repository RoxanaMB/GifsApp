import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'mFdaeGybeb8m4lf0RE2PCh6EyKwqE234';
  private serviceURL: string = 'http://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Ready');
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');

    this.http.get<SearchResponse>(`${ this.serviceURL }/search`, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
      });

    // -- Otra forma de hacerlo -- //
    // fetch('http://api.giphy.com/v1/gifs/search?api_key=mFdaeGybeb8m4lf0RE2PCh6EyKwqE234&q=valorant&limit=10')
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))

    // -- Otra forma de hacerlo -- //
    // const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=mFdaeGybeb8m4lf0RE2PCh6EyKwqE234&q=valorant&limit=10')
    // const data = await resp.json();
    // console.log(data);
  }
}
