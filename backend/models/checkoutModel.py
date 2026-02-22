from enum import Enum
from pydantic import BaseModel, Field


class PaymentMethod(str, Enum):
    cod = "cod"
    mock = "mock"
    momo_qr = "momo_qr"


class CreateCheckoutBody(BaseModel):
    phone_no: str = Field(..., min_length=8, max_length=20)
    address: str = Field(..., min_length=5, max_length=500)
    payment_method: PaymentMethod = Field(default=PaymentMethod.momo_qr)


class ConfirmCheckoutBody(BaseModel):
    order_id: str = Field(..., min_length=5, max_length=100)
    payment_method: PaymentMethod = Field(default=PaymentMethod.momo_qr)
