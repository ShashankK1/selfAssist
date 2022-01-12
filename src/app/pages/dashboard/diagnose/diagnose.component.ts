import { HttpService } from './../../../Services/http.service';
import { Component, Input, NgZone, OnInit } from "@angular/core";

@Component({
    selector: 'ngx-diagnose',
  styleUrls: ['./diagnose.component.scss'],
  templateUrl: './diagnose.component.html',
})
export class DiagnoseComponent implements OnInit{

    sessionId:string='';
    constructor(
        private http:HttpService,
    ){
        
    }
    ngOnInit():void{
        
        this.establishConnection();
        this.getAllSymptoms();
    }

    currentValue = 0;
    allSymptoms:string[]=[];
    selectedSymptoms:{value:any,symptom:string}[] = [];
    currentSymptom:string;
   
    readableResult:{disease:string,percentage:any}[] = [];

    establishConnection(){
        const data = this.http.getMedicalInitSessionId().subscribe((data)=>{
            this.sessionId = data['SessionID'];
            this.http.postMedicalTermsOfUse(this.sessionId.toString()).subscribe((x)=>{
            });
        });
        
    }

    getAllSymptoms(){
        this.http.getMedicalFeatures().subscribe((data:any)=>{
            this.allSymptoms = data['data'];
            this.currentSymptom = this.allSymptoms[0];
        });
    }

    onSelectionChange(event){
        this.currentSymptom = event;
    }

    onSymptomAdd(){

        this.selectedSymptoms.push({value:this.currentValue,symptom:this.currentSymptom});
    }

    onSymptomRemove(){
        let index;
        this.selectedSymptoms.map((x,i)=>{
            if(x.symptom === this.currentSymptom && this.currentValue === x.value){
                index = i;
            }
        })
        if(index>-1){
            this.selectedSymptoms.splice(index,1);
        }
        
        
    }

    selectFeatureByClick(x){
        this.currentValue = x.value;
        this.currentSymptom = x.symptom;
    }

    async startAnalyze(){
        this.readableResult = [];
        this.selectedSymptoms.map(async (data:any)=>{
            await this.http.updateMedicalFeatures(data.symptom,data.value,this.sessionId).toPromise();
        });

        const myData = await this.http.analyzeMedicalFeatures(this.sessionId).toPromise();
        myData['Diseases'].map((x:any)=>{
            this.readableResult.push({disease:Object.keys(x).toString(),percentage:Object.values(x)});
        })
        console.log(this.readableResult);
    }
   
}