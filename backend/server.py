import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
import bcrypt

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./backend/credentials/textswapfinal-firebase-adminsdk-v2sag-561a397a16.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Function to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    university = data.get('university')

    if not email or not password or not name or not university:
        return jsonify({'error': 'All fields (name, university, email, password) are required'}), 400

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

        # Save user data to Firestore (store email as a simple string)
        user_data = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'university': university
        }
        db.collection('users').document(user.uid).set(user_data)

        return jsonify({"message": "Verification email sent successfully"}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

def send_verification_email(email, verification_link):
    # SMTP server configuration (example using Gmail)
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'textswap1@gmail.com'  
    smtp_password = 'nqgsvuabnzuehrho'  

    subject = "Verify your email for TextSwap"
    body = f"Hi, please verify your email by clicking the link: {verification_link} \n\nThank you, \nTextSwap Support"

    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = 'TextSwap Support'
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Send the email using SMTP
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Function to login a user
@app.route('/login', methods=['POST'])
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        # Retrieve user by email from Firebase Auth
        user = auth.get_user_by_email(email)

        # Check if the user's email is verified
        if not user.email_verified:
            return jsonify({'error': 'Please verify your email before logging in'}), 403

        # Retrieve user data from Firestore
        user_ref = db.collection('users').document(user.uid).get()
        if not user_ref.exists:
            return jsonify({'error': 'Invalid email or password'}), 401

        user_data = user_ref.to_dict()
        hashed_password = user_data.get('password')

        # Verify the password
        if not bcrypt.checkpw(password.encode('utf-8'), hashed_password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Generate a custom Firebase token for the user
        token = auth.create_custom_token(user.uid)

        return jsonify({'token': token.decode('utf-8')}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Function to create textbook listing
@app.route('/create_listing', methods=['POST'])
def create_listing():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    course_number = data.get('course_number')
    condition = data.get('condition')
    price = data.get('price')  # This should already be a float
    other_desired_titles = data.get('other_desired_titles')
    user_email = data.get('user_email')  # Assume this comes from the request
    
    # Check for missing fields
    if not title or not author or not course_number or not condition or not price or not user_email:
        return jsonify({'error': 'All fields are required'}), 400

    # Ensure price is a float
    try:
        price = float(price)  # Convert price to float
    except ValueError:
        return jsonify({'error': 'Price must be a valid number'}), 400

    # Prepare listing data (store user_email as a string)
    listing_data = {
        'title': title,
        'author': author,
        'course_number': course_number,
        'condition': condition,
        'price': price,  # Store price as a float
        'other_desired_titles': other_desired_titles,
        'user_email': user_email,  # Store as string
    }

    try:
        # Add the listing to Firestore
        db.collection('listings').add(listing_data)
        return jsonify({"message": "Listing created successfully"}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/search_listings', methods=['GET'])
def search_listings():
    course_number = request.args.get('course_number')
    title = request.args.get('title')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    # Start a query to fetch listings
    query = db.collection('listings')

    if course_number:
        query = query.where('course_number', '==', course_number)
    if title:
        query = query.where('title', '==', title)
    if min_price is not None and max_price is not None:
        query = query.where('price', '>=', min_price).where('price', '<=', max_price)
    elif min_price is not None:
        query = query.where('price', '>=', min_price)
    elif max_price is not None:
        query = query.where('price', '<=', max_price)

    try:
        results = query.stream()
        listings = []
        for listing in results:
            listings.append(listing.to_dict())
        
        return jsonify(listings), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/user_listings', methods=['GET'])
def get_user_listings():
    user_email = request.args.get('user_email')
    print(user_email)
    if not user_email:
        return jsonify({'error': 'User email is required'}), 400

    try:
        # Query Firestore for listings associated with the user's email
        user_listings = db.collection('listings').where('user_email.userEmail', '==', user_email).stream()
        listings = []
        for listing in user_listings:
            listings.append(listing.to_dict())

        return jsonify({"listings": listings}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
