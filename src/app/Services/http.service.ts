import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http:HttpClient
  ) { }

  headers = new HttpHeaders().set('x-rapidapi-key','d0b3eea1a4msh456d8afae0a1486p1171c8jsn79f64cfd2ec6').set('x-rapidapi-host','vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com')

  getSpecificCountryCovid19Data(countryName:string,countryIso:string){
    return this.http.get(`${environment.CORONA_URL}country-report-iso-based/${countryName}/${countryIso}`,{headers:this.headers});
  }

  getCovidNews(page:string){
    return this.http.get(`${environment.CORONA_NEWS}${page}`,{headers:this.headers});
  }

  medicalHeader = new HttpHeaders().set('x-rapidapi-key','d0b3eea1a4msh456d8afae0a1486p1171c8jsn79f64cfd2ec6').set('x-rapidapi-host','endlessmedicalapi1.p.rapidapi.com')
  termsOfUse:string='I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com'
  getMedicalInitSessionId(){
    return this.http.get(`${environment.MEDICAL_API}/InitSession`,{headers:this.medicalHeader});
  }

  postMedicalTermsOfUse(sessionId:string){
    const termsOfUseparams = new HttpParams().set('SessionID',sessionId).set('passphrase',this.termsOfUse)
    const termsOfUseOptions = {
      headers:this.medicalHeader,
      params:termsOfUseparams
    };
    return this.http.post(`${environment.MEDICAL_API}/AcceptTermsOfUse`,{},termsOfUseOptions);
  }

  getMedicalFeatures(){
    return this.http.get(`${environment.MEDICAL_API}/GetFeatures`,{headers:this.medicalHeader})
  }

  updateMedicalFeatures(name:string,value:string,sessionId:string){
    const updateParams = new HttpParams().set('name',name).set('value',value).set('SessionID',sessionId);
    const updateOptions = {
      headers:this.medicalHeader,
      params:updateParams
    }
    return this.http.post(`${environment.MEDICAL_API}/UpdateFeature`,{},updateOptions);
  }
  
  analyzeMedicalFeatures(sessionId:string){
    const Analyseparams = new HttpParams().set('SessionID',sessionId)
    const AnalyseOptions = {
      headers:this.medicalHeader,
      params:Analyseparams
    };
    return this.http.get(`${environment.MEDICAL_API}/Analyze`,AnalyseOptions);
  }

}
