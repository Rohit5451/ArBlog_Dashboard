import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService : AuthService){}

  userEmail! : string ;
  isLoggedIn$! : Observable<boolean>;


  ngOnInit(): void {
    const userString = localStorage.getItem('user');

    if (userString) {
      const userObject = JSON.parse(userString);
      console.log(userObject.email);
      this.userEmail = userObject.email;
      console.log(userObject);
    } else {
      // Handle the case when 'user' key is not found in localStorage.
      // For example, you can set a default value for userEmail.
      this.userEmail = 'Guest';
    }

     this.isLoggedIn$ =  this.authService.isLoggedIn();
  }

  onLogOut(){
    this.authService.logOut();
  }

}
