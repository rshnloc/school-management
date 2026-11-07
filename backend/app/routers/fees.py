from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import FeeInvoice, Student
from ..schemas import FeeInvoiceResponse, FeePayRequest

router = APIRouter(prefix="/fees", tags=["fees"])

@router.get("", response_model=List[FeeInvoiceResponse])
def get_fees(student_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FeeInvoice)
    if student_id:
        query = query.filter(FeeInvoice.student_id == student_id)
    if status and status != "All":
        query = query.filter(FeeInvoice.status == status)

    invoices = query.order_by(FeeInvoice.id.desc()).all()
    results = []
    for inv in invoices:
        s_name = f"{inv.student.first_name} {inv.student.last_name}" if inv.student else "Student"
        results.append(FeeInvoiceResponse(
            id=inv.id,
            invoice_number=inv.invoice_number,
            student_id=inv.student_id,
            student_name=s_name,
            title=inv.title,
            amount=inv.amount,
            due_date=inv.due_date,
            status=inv.status,
            paid_date=inv.paid_date,
            payment_method=inv.payment_method
        ))
    return results

@router.post("/{invoice_id}/pay", response_model=FeeInvoiceResponse)
def pay_invoice(invoice_id: int, req: FeePayRequest, db: Session = Depends(get_db)):
    invoice = db.query(FeeInvoice).filter(FeeInvoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = "Paid"
    invoice.paid_date = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    invoice.payment_method = req.payment_method
    db.commit()
    db.refresh(invoice)

    s_name = f"{invoice.student.first_name} {invoice.student.last_name}" if invoice.student else "Student"
    return FeeInvoiceResponse(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        student_id=invoice.student_id,
        student_name=s_name,
        title=invoice.title,
        amount=invoice.amount,
        due_date=invoice.due_date,
        status=invoice.status,
        paid_date=invoice.paid_date,
        payment_method=invoice.payment_method
    )

