import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Page } from 'ui/page';
import { Slider } from "tns-core-modules/ui/slider";
import { TextField } from "tns-core-modules/ui/text-field";
import { Comment } from '../shared/comment';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    commentForm: FormGroup;
    author: string;
    rating: number;
    commentText: string;
    comment: Comment;

    constructor(private params: ModalDialogParams,
        private page: Page,
        private formBuilder: FormBuilder) {

        this.commentForm = this.formBuilder.group({
            author: ['', Validators.required],
            rating: 5,
            comment: ['', Validators.required]
        });
    }

    ngOnInit() {

    }

    public submit() {
      if (this.commentForm.valid) {
        let slider: Slider = <Slider>this.page.getViewById<Slider>('sliderRating');
        this.rating = slider.value;
        let authorTextField: TextField = <TextField>this.page.getViewById<TextField>('textFieldAuthor');
        this.author = authorTextField.text;
        let commentTextField: TextField = <TextField>this.page.getViewById<TextField>('textFieldComment');
        this.commentText = commentTextField.text;
        this.comment = {rating: this.rating, comment: this.commentText, author: this.author, date: (new Date()).toISOString()};
        this.params.closeCallback(this.comment);
      }
    }
}
