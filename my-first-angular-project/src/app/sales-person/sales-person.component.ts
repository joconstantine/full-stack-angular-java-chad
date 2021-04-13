import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css']
})
export class SalesPersonComponent implements OnInit {

  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public salesVolume: number) { }

  ngOnInit(): void {
  }

}
