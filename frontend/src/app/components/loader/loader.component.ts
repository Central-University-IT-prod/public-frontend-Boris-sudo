import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  static show_loader() {
    const loader = document.getElementById('loader')!;
    loader.style.display = 'block';
  }

  static hide_loader() {
    const loader = document.getElementById('loader')!;
    loader.style.display = 'none';
  }
}
