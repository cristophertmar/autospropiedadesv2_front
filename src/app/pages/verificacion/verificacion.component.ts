import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {

  constructor(
    private _shared: SharedService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this._activatedRoute.params.subscribe( ({id}) => {
      console.log(id);
    });


  }



}
