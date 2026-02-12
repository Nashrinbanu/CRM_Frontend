import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JwtServiceService } from '../../../auth/services/jwt-service/jwt-service.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public isDropdownVisible = false;
  public hoverState: string = '';
  public clickedState: string = '';
  public decodedToken: any;
  public isMenuVisible = false;
  public showLogoutConfirmation = false;
  public icons = [
    { src: 'assets/New-Icons/NewDashboard.svg', alt: 'Dashboard Icon', route: '/dashboard', name: 'Dashboard' },
    { src: 'assets/New-Icons/NewLeads.svg', alt: 'Leads Icon', route: '/leads', name: 'Leads' },
    { src: 'assets/New-Icons/NewContact.svg', alt: 'Contacts Icon', route: '/staffs', name: 'Staffs' },
    { src: 'assets/New-Icons/NewCalender.svg', alt: 'Calendar Icon', route: '/calendar', name: 'Calendar' },
    { src: 'assets/New-Icons/NewNotifiCation.svg', alt: 'Notifications Icon', route: '/notifications', name: 'Notifications' },
    { src: 'assets/New-Icons/NewMessage.svg', alt: 'Messages Icon', route: '/messages', name: 'Messages' },
    { src: 'assets/New-Icons/NewSettings.svg', alt: 'Settings Icon', route: '/settings', name: 'Settings' },
  ];


  constructor(private router: Router, private jwtService: JwtServiceService,private cdr: ChangeDetectorRef) { }
  @HostListener('document:click', ['$event'])

  ngOnInit(): void {
    const token = localStorage.getItem('crmAuthToken');
    this.decodedToken = this.jwtService.decodeToken(token);
    const isExpired = this.jwtService.isTokenExpired(token);
  }

  handleClickOutside(event: Event) {
    const dropdownElement = document.querySelector('.dropdown-menu');
    const profileElement = document.querySelector('.profile-img');

    if (
      dropdownElement &&
      !dropdownElement.contains(event.target as Node) &&
      profileElement &&
      !profileElement.contains(event.target as Node)
    ) {
      this.isDropdownVisible = false;
    }
  }

  extraIcon = [
    { src: 'assets/New-Icons/NewSearch.svg', alt: 'Search Icon', route: '/search', name: 'Search' },
    { src: 'assets/New-Icons/NewMail.svg', alt: 'Mail Icon', route: '/mail', name: 'Mail' },
    { src: 'assets/New-Icons/NewNotificationTwo.svg', alt: 'Contacts Icon', route: '/notificationsDetails/details', name: 'Notifications' },
  ];

  logOut() {
    this.showLogoutConfirmation = true;
    this.isDropdownVisible = false;
  }

  confirmLogout() {
    localStorage.removeItem('crmAuthToken');
    this.router.navigate(['/login']);
    this.showLogoutConfirmation = false;
  }

  cancelLogout() {
    this.showLogoutConfirmation = false;
  }

  onMouseEnter(iconRoute: string) {
    if (this.router.url !== iconRoute) {
      this.hoverState = iconRoute;
    }
  }

  onMouseLeave() {
    this.hoverState = '';
  }

  closeMenu() {
    this.isMenuVisible = false;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
  
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
    this.toggleBodyScroll(this.isMenuVisible);
  }

  toggleBodyScroll(shouldDisable: boolean) {
    if (shouldDisable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 1024) {
      this.isMenuVisible = false;
      this.toggleBodyScroll(false);
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.isDropdownVisible = false;
  }

  isMobileScreen(): boolean {
    return window.innerWidth < 1024;
  }

  updateState(state: string) {
    this.clickedState = state;
    this.cdr.detectChanges(); 
  }
}