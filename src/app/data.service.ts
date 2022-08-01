import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

URL='assets/data.json';
  constructor(private http: HttpClient) { }

  getAllData(){
    return this.http.get<any>(this.URL);
  }
}
