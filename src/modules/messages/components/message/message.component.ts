import { Component, OnInit } from '@angular/core';
import { StaffsService } from '../../../staffs/services/staffs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../staffs/services/message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  userMessage = "";
  messages: any[] = [];
  loading = false;
  searchQuery = "";
  contacts: any[] = [];

  selectedContact: any = null;

  constructor(private chatbot: MessageService, private staffs: StaffsService) { }

  ngOnInit(): void {
    this.staffs.getstaff().subscribe({
      next: (res: any[]) => {
        this.contacts = (res || []).map(s => ({
          id: s.id,
          name: s.name || s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || ('User ' + (s.id || '')),
          status: s.status || (s.is_online ? 'online' : 'offline'),
          lastMessage: s.last_message || '',
          lastSeen: s.last_seen || s.updated_at || '',
          messages: s.messages && Array.isArray(s.messages) ? s.messages : []
        }));

        if (this.contacts.length) {
          this.selectContact(this.contacts[0]);
        }
      },
      error: () => {
        console.error('Failed to load staffs for contacts');
      }
    });
  }

  sendMessage() {
    if (!this.userMessage.trim() || !this.selectedContact) return;

    const messageText = this.userMessage.trim();

    // push user message to current conversation
    const userMsg = { sender: 'user', text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    this.selectedContact.messages.push(userMsg);
    this.messages = this.selectedContact.messages;

    // update preview on contacts list
    this.selectedContact.lastMessage = messageText;

    const query = messageText;
    this.userMessage = "";
    this.loading = true;

    this.chatbot.askBot(query).subscribe({
      next: (res) => {
        this.loading = false;
        const botMsg = {
          sender: 'bot',
          text: res?.answer || '⚠️ No response',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.selectedContact.messages.push(botMsg);
        this.messages = this.selectedContact.messages;
      },
      error: () => {
        this.loading = false;
        const errMsg = { sender: 'bot', text: '⚠️ Server error. Please try again.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.selectedContact.messages.push(errMsg);
        this.messages = this.selectedContact.messages;
      }
    });
  }

  selectContact(c: any) {
    this.selectedContact = c;
    this.messages = this.selectedContact.messages;
  }
}
