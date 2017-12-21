import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Page } from "ui/page";
import { View } from "ui/core/view";

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    formView: View;
    summaryView: View;
    showForm: boolean = true;
    sumbittedReservation = {guests: '', smoking: '', dateTime: ''};

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private page: Page) {
            super(changeDetectorRef);
            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
    }

    ngOnInit() {
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });
    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        } else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ dateTime: textField.text});
    }

    onSubmit() {
        this.sumbittedReservation = this.reservation.value;
        console.log(JSON.stringify(this.sumbittedReservation));
        this.animate();
    }

    animate() {
      this.formView = this.page.getViewById<View>('formView');
      this.summaryView  = this.page.getViewById<View>('summaryView');

      this.formView.animate({
        duration: 500,
        opacity: 0,
        scale: { x: 0, y: 0}
      }).then(() => {
          this.showForm = false;
          this.summaryView.animate({
            duration: 500,
            opacity: 1,
            scale: { x: 1, y: 1}
          })
      })
    }
}
