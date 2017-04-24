import { Component } from '@angular/core';
import {FormGroup,FormControl,FormBuilder,Validators} from '@angular/forms';
import {PostService} from '../post.service';
@Component({
  selector: 'dataform',
  template: `
  
  <div class="well col-md-6">
    <form [formGroup]="myForm" (ngSubmit)="submitForm(myForm)" class="form-group">
      
      <label for="name" >Name</label><br>
      <input name= "name" type="text" [formControl]="myForm.controls['name']"  #uname class="form-control"/><br>
      <div *ngIf="!myForm.controls['name'].valid" class="validator">Required</div>
      
      <label for="email" >Email</label><br>
      <input name="email" type="text" [formControl]="myForm.controls['email']" #uemail class="form-control"/><br>
      <div *ngIf="!myForm.controls['email'].valid" class="validator">Required</div>
      
      <label for="post" >Post</label><br>
      <input name="title" type="text" disabled placeholder="Title" [formControl]="myForm.controls['title']" class="form-control"/><br>
      <textarea name="post" type="text" [formControl]="myForm.controls['post']" #upost class="form-control"></textarea>
      <div *ngIf="!myForm.controls['post'].valid" class="validator">Minimum Length 10</div><br>
      <input type="submit" class="btn btn-primary" value="Submit" [disabled]="!myForm.valid" />
    </form>
  </div>
  <div class="col-md-12"><input type="submit" class="btn btn-success" value="Get Data" (click)="getData(myForm.controls['name'].value)"/></div>
  
  `,
  styles: ['.validator{color: red}'],
  providers:[PostService]
})
export class DataformComponent {
  myForm:FormGroup;
  data: Object;
  constructor(private fb:FormBuilder, private postservice:PostService){
    this.myForm = fb.group({
      name:['',Validators.required],
      email:['',Validators.required],
      title:['',Validators.required],
      post:['',Validators.compose([Validators.required,this.validatePost])]
    });
  }

  submitForm(form){
    console.log(form.value);
  }

  validatePost(control:FormControl){
      if(control.value.Length<10){
        console.log('valid');
        return {'invalid':true};
      }
       return null; 
  }

  getData(value){
    console.log('Getting Data For '+value);
    this.postservice.getData().subscribe(data=>{
      console.log(data.json());
      let dt = data.json();
      this.postservice.getPost().subscribe(data=>{
          let posts = data.json();
          this.myForm = this.fb.group({
            name:[dt.name, Validators.required],
            email:[dt.email, Validators.required],
            title:[posts[0].title, Validators.required],
            post:[posts[0].body,Validators.compose([Validators.required, this.validatePost])]
          });
      });  
    });
  }
}
