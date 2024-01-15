import { Component, Input } from '@angular/core'
import { StorageService } from 'src/app/_services/storage.service';
@Component({
  selector: 'app-addfriend',
  templateUrl: 'addfriend.component.html',
  styleUrls: ['addfriend.component.css'],
})
export class Addfriend {

  FirstName:string ="" ;
  LastName:string = ""; 
  constructor(private   storageService: StorageService) {

  }
  ngOnInit(): void {
    let user = this.storageService.getUser() ; 
    this.FirstName = user.firstName ; 
    this.LastName = user.lastName ; 
      
  }
 


}
