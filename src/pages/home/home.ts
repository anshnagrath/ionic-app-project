import { CommonProvider } from './../../providers/common/common';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddDataPage } from '../adddata/adddata';
import { EditDataPage } from '../editdata/editdata';
import { Chart } from 'chart.js';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {
  expenses: any = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  grossIncome = 0;
  grossExpense = 0;
  date = 0; 
currency:any;

  storedValue = "$";
 
    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
 
    barChart: any;
    doughnutChart: any;
    lineChart: any;
 
    



  constructor(public navCtrl: NavController,
    private sqlite: SQLite, public common: CommonProvider) {

    }
   
        
    
getBarCart(expense,income) {
  this.barChart = new Chart(this.barCanvas.nativeElement, {

    type: 'bar',
    data: {
        labels: ["Gross Income", "Gross Expense"],
        datasets: [{
            label: 'income',
            data: [income, expense],
            backgroundColor: [
               
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                
            ],
            borderColor: [
                
                'rgba(54, 162, 235, 1)',
                'rgba(255,99,132,1)',
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }

});
}
    ionViewDidLoad() {
  
      this.getBarCart(this.grossExpense, this.grossIncome);
      this.getDonutChart(this.grossExpense, this.grossIncome);
       

  

}

    
    
  getDonutChart(expense, income) {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
          labels: ["Gross Expense", "Gross Income"],
          datasets: [{
              label: '',
              data: [expense,income],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  
              ]
          }]
      
        }
  });

  }
    
    
    ionViewWillEnter() {
      this.getData();
    }
    
    getData() {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INT)', {})
        .then(res => console.log('Executed SQL')
      )    .catch(e => console.log(e));
      
       

        db.executeSql('SELECT * FROM expense ORDER BY rowid DESC', {})
        .then(res => {
          this.expenses = [];
          for(var i=0; i<res.rows.length; i++) {
            this.expenses.push({rowid:res.rows.item(i).rowid,date:res.rows.item(i).date,type:res.rows.item(i).type,description:res.rows.item(i).description,amount:res.rows.item(i).amount})
          }
         
          
          for(i=0;i < this.expenses.length;i++){
            if (this.expenses[i].type === 'Income') {
              console.log(">>>income value", this.expenses[i].amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                this.grossIncome = this.grossIncome + this.expenses[i].amount;
                console.log(this.grossIncome);
               
              } 
          }       
         for(i=0;i<this.expenses.length;i++){
           if (this.expenses[i].type === 'Expense') {
             this.grossExpense =  this.grossExpense + this.expenses[i].amount;
           }
         }
         
        

          })


        .catch(e => console.log(e));
    
    
    
        db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', {})
        .then(res => {
          if(res.rows.length>0) {
            this.totalIncome = parseInt(res.rows.item(0).totalIncome);
            this.balance = this.totalIncome-this.totalExpense;


          }    
        })
        .catch(e => console.log(e));
       
        db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"', {})
        .then(res => {
          if(res.rows.length>0) {
            this.totalExpense = parseInt(res.rows.item(0).totalExpense);
            this.balance = this.totalIncome-this.totalExpense;
         
         
          }
        })
      }).catch(e => console.log(e));
      
    }
    
    addData() {
      this.navCtrl.push(AddDataPage);
    
    }
    
    editData(rowid) {
      this.navCtrl.push(EditDataPage, {
        rowid:rowid
      });
     
    }
    
    deleteData(rowid) {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM expense WHERE rowid=?', [rowid])
        .then(res => {
          console.log(res);
          this.getData();
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
     
    }

  
    // to change currency
    currencyConvert(event){
      console.log(event, 'event');
      if(this.currency == "rs"){
        this.common.storedValue = "₹";
      }
      else if(this.currency == "d"){
        this.common.storedValue = "$";
      }
    }
  

  }