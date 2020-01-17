import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AppserviceService } from "src/app/appservice.service"

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verificration.component.css']
})
export class VerificationComponent implements OnInit {
  isLoading: boolean = true;
  userName: string;
  cookieValue: string;
  cookieAvailable: boolean;
  constructor( 
    private router: Router,
    private appservice: AppserviceService,
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService
    ) 
    { }

  ngOnInit() {
    // console.log(this.activatedRoute.snapshot.params.name);
    // this.appservice.currentMessage.subscribe(name => (this.userName = name));
    // this.cookie.set("ttemail", "James");
    // this.cookieAvailable = this.cookie.check("ttemail");
    // if (this.cookieAvailable == true) {
    //   this.appservice
    //     .getEmployeeRole(this.cookie.get("ttemail"))
    //     .subscribe(response => {
          // console.log("Response", response[0].emp_role);
          // switch (response[0].emp_role) {
          //   case "Administrator":
              // this.appservice.changeMessage(response[0].emp_name);
//               localStorage.setItem("username", response[0].emp_name);
//               localStorage.setItem("empId", response[0].emp_id.toString());
//               this.isLoading = false;
//               this.router.navigate(["admin/projects"]);
//               break;
//   }
//         }
//       }
 }
}

