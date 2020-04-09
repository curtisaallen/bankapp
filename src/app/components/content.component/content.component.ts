import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import data from '../../../transactions.json';

// This interface may be useful in the times ahead...
interface Transaction {
  amount: string;
  categoryCode: string;
  merchant: string;
  merchantLogo: string;
  transactionDate: number;
  transactionTypes: string;
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {
  transactionModel: Transaction;
  transactions = [];
  transactionsCopy = [];
  filterBy: string;
  searchTransaction: string;
  filterAmount = false;
  filterDate = false;
  filterPayment = false;
  overdraft: string;

  constructor(private http: HttpClient) {
    
  }
  ngOnInit() {
      this.getTransactions();
      this.onTransfer(false);
  }
  getTransactions() {
      return this.http.get('assets/transactions.json').toPromise().then((data:any) => { this.transactions = data.data;})
  }
  getBackgroundColor(color) {
      return color;
  }
  filterSearchInput(value) {
    this.filterBy = value;
    if(this.filterBy != ''){
    this.transactions = this.transactions.filter(res => {
        return res.merchant.toLocaleLowerCase().match(this.filterBy.toLocaleLowerCase());
    });
    } else {
       this.ngOnInit();
    }
  }
  sortType(type, $event) {
    $event.stopPropagation()
    if(type === 'amount') {
        if(this.filterAmount === false) {
           this.transactions = this.transactions.sort(this.sortByAmount);
           this.filterAmount = true;
        } else {
           this.ngOnInit();
           this.filterAmount = false;
        }
    }
    if(type === 'date') {
        if(this.filterDate === false) {
           this.transactions = this.transactions.sort(this.sortByDate);
           this.filterDate = true;
        } else {
           this.ngOnInit();
           this.filterDate = false;
        }
    }
    if(type === 'payment') {
        if(this.filterPayment === false) {
           this.transactions = this.transactions.sort(this.sortByPaymentType);
           this.filterPayment = true;
        } else {
           this.ngOnInit();
           this.filterPayment = false;
        }
    }   
}

  
  sortByAmount(a1,a2) {
    return parseInt(a1.amount) - parseInt(a2.amount);
  }

 sortByDate(d1,d2) {
    return (new Date(d1.transactionDate) as any) - (new Date(d2.transactionDate) as any);
 }

 sortByPaymentType(p1,p2) {
    if(p1.transactionType < p2.transactionType) { return -1; }
    if(p1.transactionType > p2.transactionType) { return 1; }
    return 0;
 }


  onTransferClicked(transfer): void {
    let findVal = this.transactions.filter((data) => { 
    return data.merchant ===  transfer.value.accountfrom 
    });
    let getVal: any = findVal.map((data) => data['amount']);
    if(getVal > transfer.value.amount) {
        let subtractVal = parseFloat(getVal) - parseFloat(transfer.value.amount);
        for (var i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].merchant === transfer.value.accountfrom) {
                this.transactions[i].amount = subtractVal.toString();
                break;
            }
        }
    } else { 
        this.overdraft = 'You Have Overdraft Your Account'
    }

    if(this.overdraft != 'You Have Overdraft Your Account') {
        let findValTo = this.transactions.filter((data) => { return data.merchant ===  transfer.value.accountto });
        let changeValTo: any = findValTo.map((data) => data['amount']);
        let addVal = parseFloat(changeValTo) + parseFloat(transfer.value.amount);
         for (var i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].merchant === transfer.value.accountto) {
                this.transactions[i].amount = addVal.toString();
                break;
            }
        }
       this.onTransfer(this.transactions);
    }

  }
  
  onTransfer(value) {
      if(value != null || value === false) {
         return this.transactions = value;
      } 
  }




}