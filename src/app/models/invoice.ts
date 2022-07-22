export interface InvoiceEntry {
    appearanceId: number,
    attorneyId: Number,
    invoiceDate: Date,
    invoiceDueDate: Date,
    hourlyRate: number,
    noHours: number,
    adjustmentAmount: number,
    latePayment: number,
    totalAmount: number,
  remarks: string,
  //Following 1 line added by atul on 17 may 22 for invoice draft feature
    invoiceNo: string,
    //Following 1 line added by atul on 24 jun 22 for invoice minutes feature
    minutes: number
  }

export interface RejectReason{
  remarks: string,
  rejectedById: Number
}

export interface Rating {
  userMasterId: Number,
  ratingById: Number,
  ratingPoints: number,
  ratingRemarks: string,
  appearanceId: number,
  userMasterType: string,
  ratingByType: string
}