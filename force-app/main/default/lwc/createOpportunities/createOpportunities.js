import { LightningElement, track, wire } from "lwc";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import OPPORTUNITY_OBJECT from "@salesforce/schema/Opportunity";
import STAGE_FIELD from "@salesforce/schema/Opportunity.StageName";
import getNumberOfAllAccounts from "@salesforce/apex/AccountController.getNumberOfAllAccounts";
import createOpportunities from "@salesforce/apex/OpportunityController.createOpportunities";

export default class CreateOpportunities extends LightningElement {
  @track listOfSelectedAccountIds = [];
  @track stageValues;
  numberOfAllAccounts;
  oppAmount;
  oppStage;
  closeDate;

  @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
  wiredOpportunityInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$wiredOpportunityInfo.data.defaultRecordTypeId",
    fieldApiName: STAGE_FIELD
  })
  wiredStageValues({ error, data }) {
    if (data) {
      this.stageValues = [];
      data.values.forEach((stage) => {
        let stInfo = {};
        stInfo.label = stage.label;
        stInfo.value = stage.value;
        this.stageValues.push(stInfo);
      });
    } else if (error) {
      this.showNotification("ERROR", error.body.message, "error");
    }
  }

  connectedCallback() {
    getNumberOfAllAccounts()
      .then((data) => (this.numberOfAllAccounts = data))
      .catch((error) =>
        this.showNotification("ERROR", error.body.message, "error")
      );
  }

  handleUpdate(event) {
    switch (event.target.name) {
      case "opportunityAmount":
        this.oppAmount = parseFloat(event.detail.value);
        break;
      case "closeDate":
        this.closeDate = event.detail.value;
        break;
      case "stagePicker":
        this.oppStage = event.detail.value;
        break;
    }
  }

  setSelectedAccIds(event) {
    this.listOfSelectedAccountIds = event.detail;
  }

  showNotification(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }

  get canCreateOpportunities() {
    if (
      this.listOfSelectedAccountIds.length > 0 &&
      this.oppAmount &&
      this.closeDate &&
      this.oppStage
    ) {
      return true;
    }
    return false;
  }

  createOpportunities() {
    createOpportunities({
      accountIds: this.listOfSelectedAccountIds,
      closeDate: this.closeDate,
      stage: this.oppStage,
      amount: this.oppAmount
    })
      .then((results) => {
        const jsonResults = JSON.parse(results);
        const oppsCreated = [];
        const oppsNotCreated = [];
        jsonResults.forEach((result) => {
          result.success == true
            ? oppsCreated.push(result)
            : oppsNotCreated.push(result);
        });

        if (oppsCreated.length > 0) {
          this.showNotification(
            "SUCCESS",
            `${oppsCreated.length} Opportunities created successfully`,
            "success"
          );
        }

        if (oppsNotCreated.length > 0) {
          this.showNotification(
            "ERROR",
            `${oppsNotCreated.length} Opportunities did not get created`,
            "error"
          );
        }

        this.clearAllInputValues();
      })
      .catch((error) =>
        this.showNotification("ERROR", error.body.message, "error")
      );
  }

  clearAllInputValues() {
    this.template.querySelector("c-data-table").clearDatatable();
    this.listOfSelectedAccountIds = [];
    this.closeDate = "";
    this.oppAmount = "";
    this.oppStage = "";
  }
}
