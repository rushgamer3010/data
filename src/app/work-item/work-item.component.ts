import { Component, OnInit } from '@angular/core';
import { WorkItemService } from '../work-item.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-work-item',
  templateUrl: './work-item.component.html',
  styleUrls: ['./work-item.component.css'],
})
export class WorkItemComponent implements OnInit {
  cosmicId: string = ''; // cosmicId entered by the user
  selectedWorkItem: any = null; // Store the selected work item
  workItems: any[] = []; // Array to hold all work items fetched from JSON
  showModal: boolean = false; // Flag to control modal display

  constructor(private workItemService: WorkItemService) {}

  ngOnInit() {
    // Fetch all work items when the component initializes
    this.workItemService.getAllWorkItems().subscribe((data) => {
      this.workItems = data.cosmicData; // Store the fetched cosmic data
    });
  }

  // Preview work item details based on entered cosmicId
  preview() {
    // Get the work item by cosmicId
    this.selectedWorkItem = this.workItemService.getDetailsByCosmicId(this.cosmicId, this.workItems);

    if (this.selectedWorkItem) {
      this.showModal = true; // Open the modal if work item found
    } else {
      alert('CosmicId not found!'); // Handle case if cosmicId is not found
    }
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }

  // Download the selected data as PDF using jsPDF
  downloadPDF() {
    const doc = new jsPDF();
    let startY = 10;

    // Add Work Item Details
    if (this.selectedWorkItem) {
      const workItem = this.selectedWorkItem;

      doc.setFontSize(14);
      doc.text('Work Item Details:', 10, startY);
      startY += 10;

      // Basic Work Item Info
      doc.setFontSize(10);
      doc.text(`CosmicId: ${workItem.cosmicId || 'N/A'}`, 10, startY);
      startY += 10;
      doc.text(`Parent Case ID: ${workItem.parentCaseId || 'N/A'}`, 10, startY);
      startY += 10;
      doc.text(`Business Unit Label: ${workItem.businessUnitLabel || 'N/A'}`, 10, startY);
      startY += 10;
      doc.text(`Focus Identifier: ${workItem.focusIdentifier || 'N/A'}`, 10, startY);
      startY += 10;
      doc.text(`Focus Name: ${workItem.focusName || 'N/A'}`, 10, startY);
      startY += 10;
      doc.text(`Created By: ${workItem.createdBy || 'N/A'}`, 10, startY);
      startY += 10;

      // Risk Type Info
      if (workItem.summary && workItem.summary.length > 0) {
        const summary = workItem.summary[0];
        doc.text(`Risk Type: ${summary.riskType[0].label || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Has Existing Ticket: ${summary.hasExistingTicket || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Existing Ticket Number: ${summary.existingTicketNumber || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Internal Reference Number: ${summary.internalReferenceNumber || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Existing Ticket Reason: ${summary.existingTicketReason || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Ticket Reason Others: ${summary.ticketReasonOthers || 'N/A'}`, 10, startY);
        startY += 10;

        // Red Flags
        if (summary.redFlags) {
          for (let flag of summary.redFlags) {
            doc.text(`Red Flag: ${flag.redFlag || 'N/A'}`, 10, startY);
            startY += 10;
          }
        }

        // RFI
        if (summary.rfi && summary.rfi.Questions) {
          for (let question of summary.rfi.Questions) {
            doc.text(`RFI Question: ${question.questionText || 'N/A'}`, 10, startY);
            startY += 10;
          }
        }
      }

      // Entity Information
      if (workItem.entityInformation && workItem.entityInformation.length > 0) {
        const entity = workItem.entityInformation[0];
        doc.setFontSize(14);
        doc.text('Entity Information:', 10, startY);
        startY += 10;

        doc.setFontSize(10);
        doc.text(`Name: ${entity.name || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Category: ${entity.category || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Type: ${entity.type || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Country of Incorporation: ${entity.countryOfIncorporationLabel || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Date of Birth/Incorporation: ${entity.dateofBirthIncorporatedDate || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Corporate Registry Number: ${entity.corporateRegistryNumber || 'N/A'}`, 10, startY);
        startY += 10;
      }

      // Account Information
      if (workItem.accounts && workItem.accounts.length > 0) {
        const account = workItem.accounts[0];
        doc.setFontSize(14);
        doc.text('Account Information:', 10, startY);
        startY += 10;

        doc.setFontSize(10);
        doc.text(`Account Number: ${account.accountNumber || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Account Type: ${account.accountTypeUI || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Account Status: ${account.accountStatusUI || 'N/A'}`, 10, startY);
        startY += 10;
      }

      // Transaction Information
      if (workItem.transaction && workItem.transaction.length > 0) {
        const transaction = workItem.transaction[0];
        doc.setFontSize(14);
        doc.text('Transaction Information:', 10, startY);
        startY += 10;

        doc.setFontSize(10);
        doc.text(`Transaction ID: ${transaction.transactionReferenceId || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Transaction Date: ${transaction.transactionDate || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Amount: ${transaction.amount || 'N/A'} ${transaction.currencyCode.label || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Originator: ${transaction.originatorName || 'N/A'}`, 10, startY);
        startY += 10;
        doc.text(`Beneficiary: ${transaction.beneficiaryName || 'N/A'}`, 10, startY);
        startY += 10;
      }
    }

    // Save the PDF
    doc.save(`Cosmic_${this.cosmicId}.pdf`);
  }
}
