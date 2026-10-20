from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class PatientProfileCreate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None

class PatientProfileResponse(PatientProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- ADD THESE NEW SCHEMAS BELOW ---
class AppointmentCreate(BaseModel):
    department: str
    doctor_name: str
    appointment_date: str
    time_slot: str
    appointment_type: Optional[str] = "In-Person"
    medical_report: Optional[str] = None

class AppointmentResponse(AppointmentCreate):
    id: int
    status: Optional[str] = "Confirmed"

    class Config:
        from_attributes = True