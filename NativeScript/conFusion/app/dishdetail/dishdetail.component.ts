import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { ModalDialogParams, ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { CommentComponent } from "../Comment/comment.component";
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Toasty } from 'nativescript-toasty'
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { action } from "ui/dialogs";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  comment: Comment;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;


  constructor(private dishservice: DishService,
    private favoriteservice: FavoriteService,
    private fonticon: TNSFontIconService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
    @Inject('BaseURL') private BaseURL) {

  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => {
          this.dish = dish;
          this.favorite = this.favoriteservice.isFavorite(this.dish.id);
          this.numcomments = this.dish.comments.length;

          let total = 0;
          this.dish.comments.forEach(comment => total += comment.rating);
          this.avgstars = (total/this.numcomments).toFixed(2);
        },
        errmess => { this.dish = null; this.errMess = <any>errmess; }
      );
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to Favorites', this.dish.id);
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
      const toast = new Toasty("Added Dish "+ this.dish.id, "short", "bottom");
      toast.show();
    }
  }

  openActionItemDialog() {
    let options = {
      title: "Actions",
      message: "Choose an action",
      cancelButtonText: "Cancel",
      actions: ["Add to Favorites", "Add Comment"]
    };

    action(options).then((result: string) => {
        if (result === "Add to Favorites") {
            console.log('Action: add to favorites');
            this.addToFavorites();
        } else if (result === "Add Comment") {
            console.log('Action: add comment');
            this.openCommentForm();
        } else {
            console.log('Action cancelled');
        }
    });
  }

  openCommentForm() {
    console.log("openCommentForm()");
    let options: ModalDialogOptions = {
        viewContainerRef: this.vcRef,
        fullscreen: false
    };
    this.modalService.showModal(CommentComponent, options)
        .then((result: any) => {
          if (result) {
            console.log("model closed with submit result:");
            console.log(JSON.stringify(result));
            this.comment = result;
            this.dish.comments.push(this.comment);
            this.numcomments = this.dish.comments.length;
            let total = 0;
            this.dish.comments.forEach(comment => total += comment.rating);
            this.avgstars = (total/this.numcomments).toFixed(2);
          } else {
            console.log("modal closed without submit");
          }
        });
  }

}
