import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
  selector: 'app-contact',
  moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends DrawerPage implements OnInit {

  // cards = [
  //   {
  //     title: "Contact Information",
  //     description: "121, Clear Water Bay Road</br>Clear Water Bay, Kowloon</br>HONG KONG</br>Tel: +852 1234 5678</br>Fax: +852 8765 4321</br>Email:confusion@food.net"
  //   }
  // ]

  card = {
      title: "Contact Information",
      description: "121, Clear Water Bay Road</br>Clear Water Bay, Kowloon</br>HONG KONG</br>Tel: +852 1234 5678</br>Fax: +852 8765 4321</br>Email:confusion@food.net"
    }

  constructor(private changeDetectorRef:ChangeDetectorRef,
    @Inject('BaseURL') private BaseURL) {
      super(changeDetectorRef);
    }

  ngOnInit() {

  }

}
