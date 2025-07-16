import { Component, OnInit } from "@angular/core";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [MenubarModule],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: "Equipment",
        routerLink: "/",
      },
      {
        label: "About",
        routerLink: "/about",
      },
    ];
  }
}
