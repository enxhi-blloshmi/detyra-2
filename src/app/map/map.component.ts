import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as L from 'leaflet';
import { DataService } from '../data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map:any;
  private data: any;
  private gJson:any;
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
    
    
    
  }

  getData(){
   this.dataService.getAllData().subscribe(
      (data: any)=>{
        this.data=data.features;
        this.createMap();
        this.geoJsonMap();
      }
    );
  }

  /**
   * Funksioni qe shfaq layer-in baze te hartes
   */
  private createMap(): void{

    this.map = L.map('map').setView([40.730610, -73.935242], 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    })
    .addTo(this.map);
  }
  
  /**
   * Funksioni qe do shfaqe layer-in e hartes geojson 
   */
  private geoJsonMap():void{

    //Funksion qe perdoret per te percaktuar se ca ngjyre do kete secila feature 
    function polystyle(feature:any) {
      var color='';
      if(feature.properties.SV_Index2>=0 && feature.properties.SV_Index2<0.1)
      color='#a20407';
      else if(feature.properties.SV_Index2>=0.1 && feature.properties.SV_Index2<0.2)
      color='#f73422';
      else if(feature.properties.SV_Index2>=0.2 && feature.properties.SV_Index2<0.3)
      color='#f76c21';
      else if(feature.properties.SV_Index2>=0.3 && feature.properties.SV_Index2<0.4)
      color='#f98c55';
      else if(feature.properties.SV_Index2>=0.4 && feature.properties.SV_Index2<0.5)
      color='#f9c74a';
      else if(feature.properties.SV_Index2>=0.5 && feature.properties.SV_Index2<0.6)
      color='#90be6d';
      else if(feature.properties.SV_Index2>=0.6 && feature.properties.SV_Index2<0.7)
      color='#43aa8b';
      else if(feature.properties.SV_Index2>=0.7 && feature.properties.SV_Index2<0.8)
      color='#4d908e';
      else if(feature.properties.SV_Index2>=0.8 && feature.properties.SV_Index2<0.9)
      color='#577590';
      else if(feature.properties.SV_Index2>=0.9 && feature.properties.SV_Index2<1)
      color='#277da1';
      return{

      fillColor: color, 
      weight: 0.51, 
      opacity: 0.51, 
      color: 'black', //Outline color
      fillOpacity: 0.6 
      
  }}

    this.gJson=L.geoJSON(this.data, {
        style: polystyle,
        onEachFeature:

      function onEachFeature(feature:any, layer:any){

        layer.bindTooltip('<p style="font-family: monaco, monospace;"><b>NAMESLAD10: </b>'+feature.properties.NAMELSAD10+
              '<br><b>COUNTY:</b> '+feature.properties.County+
              '<br><b>REGION:</b> '+feature.properties.Region+
              '<br><b>SV INDEX2:</b>  '+feature.properties.SV_Index2+"</p>"
              ).openTooltip();
    }
  }).addTo(this.map);
    
}

/**
 * Funksioni qe shfaq popup ne cdo layer te hartes 
 */
  private addPopup(){

    this.gJson.eachLayer((layer: any)=>{
      var dataParagraph = document.createElement('p');
      dataParagraph.innerHTML+='<b>NAMESLAD10:</b> '+layer.feature.properties.NAMELSAD10+
      '<br><b>COUNTY:</b> '+layer.feature.properties.County+
      '<br><b>STATE:</b> '+layer.feature.properties.State+
      '<br><b>REGION:</b> '+layer.feature.properties.Region+
      '<br><b>POPDENSE:</b> '+layer.feature.properties.PopDense+
      '<br><b>HH BELOW 50:</b> ' +layer.feature.properties.HH_Below50+
      '<br><b>HH NOCAR:</b> '+layer.feature.properties.HH_NoCar+
      '<br><b>HU:</b> '+layer.feature.properties.HU+
      '<br><b>MINORITY:</b> '+layer.feature.properties.Minority+
      '<br><b>RENTERS:</b> '+layer.feature.properties.Renters+
      '<br><b>OCC HU:</b> '+layer.feature.properties.Occ_HU+
      '<br><b>OVER 65:</b> '+layer.feature.properties.Over65+
      '<br><b>POOR ENG:</b> '+layer.feature.properties.PoorEng+
      '<br><b>POP T:</b> '+layer.feature.properties.Pop_T+
      '<br><b>EMPLOYMENT:</b> '+layer.feature.properties.Employment+
      '<br><b>UNDER 18:</b> '+layer.feature.properties.Under18+
      '<br><b>PRCNT 65O:</b> '+layer.feature.properties.Prcnt_65O+
      '<br><b>PRCNT HHBM:</b> '+layer.feature.properties.Prcnt_HHBM+
      '<br><b>PRCNT LNG:</b> '+layer.feature.properties.Prcnt_Lng+
      '<br><b>PRCNT NOCA:</b> '+layer.feature.properties.Prcnt_NoCa+
      '<br><b>PRCNT RENT:</b> '+layer.feature.properties.Prcnt_Rent+
      '<br><b>PRCNT U18:</b> '+layer.feature.properties.Prcnt_U18+
      '<br><b>SV INDEX2:</b>  '+layer.feature.properties.SV_Index2+
      '<br><button id ='+layer._leaflet_id+'> Open Chart </button>';
      
      layer.bindPopup(dataParagraph, {maxHeight: 400,maxWidth:400});
      
    })}


  @HostListener('click', ['$event'])
  onclick(event: any){
    var layer=this.gJson._layers[event.target.id];

    if(event.target.tagName == 'BUTTON')
    {
      var chartDiv=document.createElement('div');
      chartDiv.style.width='400px';
      chartDiv.style.height='200px';
      chartDiv.className='chart2';

      //elementi canva ne te cilin do shfaqet grafiku
      var canva=document.createElement('canvas');
      canva.id='myChart2';

      chartDiv.append(canva);
      
      //grafiku
      const myChart = new Chart(canva, {
        type: 'bar',
        data: {
            labels: ['Prcnt_Over65', 'Prcnt_HHBM', 'Prcnt_Lng', 'Prcnt_NoCa', 'Prcnt_Rent', 'Prcnt_U18'],
            datasets: [{
                label: layer.feature.properties.NAMELSAD10,
                data: [layer.feature.properties.Prcnt_65O, layer.feature.properties.Prcnt_HHBM, layer.feature.properties.Prcnt_Lng, layer.feature.properties.Prcnt_NoCa, layer.feature.properties.Prcnt_Rent, layer.feature.properties.Prcnt_U18],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    layer.bindPopup(chartDiv, {maxHeight: 400,maxWidth:400}).openPopup();
      
  }

  else
    this.addPopup();
  }

}
