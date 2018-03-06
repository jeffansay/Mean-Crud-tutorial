import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form : FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  userValid;
  userMessage;


  constructor(private formBuilder: FormBuilder, private authService : AuthService) {
        this.createForm();

   }



  createForm() {
      this.form = this.formBuilder.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          this.validateEmail

        ])],
        username: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          this.validateUser

        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePass

        ])],
        confirm: ['', Validators.required]
      }, { validator: this.matchingPassword('password', 'confirm')});
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm () {
    this.form.controls['username'].enable();
    this.form.controls['email'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }
  onRegister() {

    this.processing = true;
    this.disableForm();

    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data =>{

        console.log(data);

        if(!data.success){
          this.messageClass = 'alert alert-danger';
         this.message = data.message;
         this.processing = false;
         this.enableForm();

       } else {
         this.messageClass = 'alert alert-success';
        this.message = data.message;
       }



    });
  }

    checkEmail() {
      const email = this.form.get('email').value;

      this.authService.checkEmail(email).subscribe(data => {

              if(!data.success){
                this.emailValid = false;
                this.emailMessage = data.message;

                console.log(data.sucess);
              } else {
                  this.emailValid = true;
                  this.emailMessage =  data.message;
              }
      });
    }

  validateEmail(controls){

const regExp = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }

  validateUser(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);

    if(regExp.test(controls.value)){
      return null;

    } else {
      return { 'validateUser': true }
    }
  }


  validatePass(controls){
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,30}/);

    if(regExp.test(controls.value)){
      return null;

    } else {
      return { 'validatePass': true }
    }
  }

  matchingPassword(password, confirm){
      return (group: FormGroup) => {
        if(group.controls[password].value === group.controls[confirm].value){
          return null;
        } else {
          return { 'matchingPassword': true }
        }
      }
  }
  ngOnInit() {
  }

}