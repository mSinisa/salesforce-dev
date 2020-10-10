import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getAccounts from "@salesforce/apex/AccountController.getAccounts";

const columns = [
  {
    label: "Account Name",
    fieldName: "Name",
    type: "Text"
  },
  {
    label: "Type",
    fieldName: "Type",
    type: "Text"
  },
  {
    label: "Phone",
    fieldName: "Phone",
    type: "Phone"
  }
];

export default class DataTable extends LightningElement {
  @api totalNumOfAccounts;
  @track accounts;
  columns = columns;

  isLoading;
  canLoadMore;
  datatableText;
  numOfRowsToSkip;
  numOfAccountsToGet;
  listOfSelectedAccountIds;

  connectedCallback() {
    this.setDefaultValues();
    getAccounts(this.parametersToGetAccounts())
      .then((listOfAccounts) => this.setAccounts(listOfAccounts))
      .catch((error) =>
        this.showNotification("Error", error.body.message, "error")
      );
  }

  loadMoreData() {
    if (this.allAccountsLoaded()) {
      this.setValuesBeforeLoadingAccounts();
      getAccounts(this.parametersToGetAccounts())
        .then((listOfAccounts) =>
          this.setValuesAfterAcctsAreLoaded(listOfAccounts)
        )
        .catch((error) =>
          this.showNotification("Error", error.body.message, "error")
        );
    } else {
      this.preventAccountLoading();
    }
  }

  handleRowAction(event) {
    this.listOfSelectedAccountIds = event.detail.selectedRows.map(
      (selectedRow) => selectedRow.Id
    );

    event.detail.selectedRows.length == 1
      ? (this.datatableText = `You have selected 1 Account`)
      : (this.datatableText = `You have selected ${event.detail.selectedRows.length} Accounts`);

    const selectEvent = new CustomEvent("accountselect", {
      detail: this.listOfSelectedAccountIds
    });
    this.dispatchEvent(selectEvent);
  }

  showNotification(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }

  parametersToGetAccounts() {
    return {
      numOfRecords: this.numOfAccountsToGet,
      numOfRecordsToSkip: this.numOfRowsToSkip
    };
  }

  allAccountsLoaded() {
    if (this.totalNumOfAccounts > this.accounts.length) {
      return true;
    }
    return false;
  }

  setDefaultValues() {
    this.isLoading = false;
    this.canLoadMore = true;
    this.numOfRowsToSkip = 0;
    this.numOfAccountsToGet = 10;
    this.datatableText = "You have selected 0 accounts";
  }

  setAccounts(responseAccounts) {
    this.accounts = responseAccounts;
  }

  setValuesBeforeLoadingAccounts() {
    this.canLoadMore = false;
    this.isLoading = true;
    this.numOfRowsToSkip += 10;
  }

  setValuesAfterAcctsAreLoaded(loadedAccounts) {
    this.accounts = this.accounts.concat(loadedAccounts);
    this.canLoadMore = true;
    this.isLoading = false;
  }

  preventAccountLoading() {
    this.canLoadMore = false;
    this.isLoading = false;
  }

  @api clearDatatable() {
    const dataTable = this.template.querySelector("lightning-datatable");
    dataTable.selectedRows = [];
    this.listOfSelectedAccountIds = [];
    this.datatableText = "You have selected 0 accounts";
  }
}
