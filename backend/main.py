import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from firebase_admin import credentials, auth, firestore, initialize_app
import bcrypt
import os
assert os.path.exists('./credentials/textswapfinal-firebase-adminsdk-v2sag-e9d2a86488.json'), "Credentials file not found"


# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./credentials/textswapfinal-firebase-adminsdk-v2sag-e9d2a86488.json')
initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Pydantic models for request bodies
class RegisterUser(BaseModel):
    email: str
    password: str
    name: str
    university: str

class LoginUser(BaseModel):
    email: str
    password: str

class ListingData(BaseModel):
    title: str
    author: str
    course_number: str
    condition: str
    price: float
    other_desired_titles: str = None
    user_email: str

# Register a new user
@app.post("/register")
async def register_user(data: RegisterUser):
    email = data.email
    password = data.password
    name = data.name
    university = data.university

    try:
        # Create a new user with email and password
        user = auth.create_user(
            email=email,
            password=password
        )
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Generate an email verification link
        verification_link = auth.generate_email_verification_link(email)

        # Send verification email
        send_verification_email(email, verification_link)

        # Save user data to Firestore
        user_data = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'university': university
        }
        db.collection('users').document(user.uid).set(user_data)

        return {"message": "Verification email sent successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Send verification email function
def send_verification_email(email, verification_link):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'textswap1@gmail.com'
    smtp_password = 'nqgsvuabnzuehrho'

    subject = "Verify your email for TextSwap"
    body = f"Hi, please verify your email by clicking the link: {verification_link} \n\nThank you, \nTextSwap Support"

    msg = MIMEMultipart()
    msg['From'] = 'TextSwap Support'
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Login a user
@app.post("/login")
async def user_login(data: LoginUser):
    email = data.email
    password = data.password

    try:
        # Retrieve user by email from Firebase Auth
        user = auth.get_user_by_email(email)

        # Check if the user's email is verified
        if not user.email_verified:
            raise HTTPException(status_code=403, detail="Please verify your email before logging in")

        # Retrieve user data from Firestore
        user_ref = db.collection('users').document(user.uid).get()
        if not user_ref.exists:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_data = user_ref.to_dict()
        hashed_password = user_data.get('password')

        # Verify the password
        if not bcrypt.checkpw(password.encode('utf-8'), hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # Generate a custom Firebase token for the user
        token = auth.create_custom_token(user.uid)

        return {"token": token.decode('utf-8')}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create a new listing
@app.post("/create_listing")
async def create_listing(data: ListingData):
    title = data.title
    author = data.author
    course_number = data.course_number
    condition = data.condition
    price = data.price
    other_desired_titles = data.other_desired_titles
    user_email = data.user_email

    listing_data = {
        'title': title,
        'author': author,
        'course_number': course_number,
        'condition': condition,
        'price': price,
        'other_desired_titles': other_desired_titles,
        'user_email': user_email,
    }

    try:
        # Add the listing to Firestore
        db.collection('listings').add(listing_data)
        return {"message": "Listing created successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))