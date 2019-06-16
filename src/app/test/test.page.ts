import { Component, OnInit } from '@angular/core';
import { ShovService } from '../shov.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  testname : string;
  x : number;
  y : number;
  n : number;

  constructor(
    private shovService : ShovService
  ) { }

  ngOnInit() {
  }

  begintest() {
    this.shovService.runTest(this.testname, this.n);
  }

}
