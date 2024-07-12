import os
from datetime import timedelta 
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt, create_access_token
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv, dotenv_values
from models import db, User, RealEstate, Purchase, Review  # Import db and models here

bcrypt = Bcrypt()
load_dotenv()
config = dotenv_values(".env")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
print(f"Connecting to database: {app.config['SQLALCHEMY_DATABASE_URI']}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key_here'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

CORS(app)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)

# Register
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Login
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# Logout
BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    BLACKLIST.add(jti)
    return jsonify({'message': 'Successfully logged out'}), 200

# Fetch current user
@app.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_data = {
        'id': user.id,
        'name': user.name,
        'email': user.email
    }
    return jsonify({'user': user_data}), 200

# Fetch all users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        user_list = []

        for user in users:
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
            user_list.append(user_data)

        return jsonify(user_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500

# Fetch single user
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    user_data = {
        'id': user.id,
        'name': user.name,
        'email': user.email
    }
    return jsonify(user_data)

@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Delete associated purchases
    try:
        Purchase.query.filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

  
# Update profile
@app.route('/profile', methods=['PATCH'])
@jwt_required()
def update_profile():
    data = request.get_json()

    loggedin_user_id = get_jwt_identity()
    user = User.query.get(loggedin_user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'}), 200

# Update password
@app.route('/password', methods=['PATCH'])
@jwt_required()
def update_password():
    data = request.get_json()

    loggedin_user_id = get_jwt_identity()
    user = User.query.get(loggedin_user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not bcrypt.check_password_hash(user.password, old_password):
        return jsonify({'message': 'Invalid old password'}), 400

    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200


# CRUD FOR REAL ESTATE LISTING
# Create a new real estate listing
@app.route('/real_estate', methods=['POST'])
def create_real_estate():
    data = request.get_json()
    title = data.get('title')
    price = data.get('price')
    address = data.get('address')
    description = data.get('description')
    user_id = data.get('user_id')

    real_estate = RealEstate(
        title=title,
        price=price,
        address=address,
        description=description,
        user_id=user_id
    )
    db.session.add(real_estate)
    db.session.commit()

    return jsonify({'message': 'Real estate listing created successfully'}), 201

# Get all real estate listings
@app.route('/real_estate', methods=['GET'])
def get_real_estates():
    try:
        real_estates = RealEstate.query.all()
        real_estate_list = []

        for real_estate in real_estates:
            real_estate_data = {
                'id': real_estate.id,
                'title': real_estate.title,
                'price': real_estate.price,
                'address': real_estate.address,
                'description': real_estate.description,
                'user_id': real_estate.user_id
            }
            real_estate_list.append(real_estate_data)

        return jsonify(real_estate_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch real estate listings', 'error': str(e)}), 500
   

# Get single real estate listing
@app.route('/real_estate/<int:id>', methods=['GET'])
def get_real_estate(id):
    real_estate = RealEstate.query.get_or_404(id)
    if not real_estate:
        return jsonify({'message': 'Real estate listing not found'}), 404
    
    real_estate_data = {
        'id': real_estate.id,
        'title': real_estate.title,
        'price': real_estate.price,
        'address': real_estate.address,
        'description': real_estate.description,
        'user_id': real_estate.user_id
    }
    return jsonify(real_estate_data), 200

# Update real estate listing
@app.route('/real_estate/<int:id>', methods=['PATCH'])
def update_real_estate(id):
    data = request.get_json()
    real_estate = RealEstate.query.get(id)
    

    if not real_estate :
        return jsonify({'message': 'You are not authorized to update this real estate listing'}), 404
    
    if 'title' in data:
        real_estate.title = data['title']
    if 'price' in data:
        real_estate.price = data['price']
    if 'address' in data:
        real_estate.address = data['address']
    if 'description' in data:
        real_estate.description = data['description']

    db.session.commit()
    return jsonify({'message': 'Real estate listing updated successfully'}), 200

# Delete real estate listing
@app.route('/real_estate/<int:id>', methods=['DELETE'])
def delete_real_estate(id):
    real_estate = RealEstate.query.get_or_404(id)    

    if not real_estate :
        return jsonify({'message': 'You are not authorized to delete this real estate listing'}), 404

    db.session.delete(real_estate)
    db.session.commit()
    return jsonify({'message': 'Real estate listing deleted successfully'}), 200

# CRUD FOR REVIEW
# Create a new review
@app.route('/reviews', methods=['POST'])

def create_review():
    try:
     data = request.get_json()
     rating = 4
     comment = data.get('newComment')
     user_id = data.get("id")
     real_estate_id = data.get('real_estate_id')

     review = Review(rating=rating, comment=comment, user_id=user_id, real_estate_id=real_estate_id)
     db.session.add(review)
     db.session.commit()

     return jsonify({'message': 'Review created successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create review', 'error': str(e)}), 500

# Get all reviews
@app.route('/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.all()
        review_list = []

        for review in reviews:
            review_data = {
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment,
                'user_id': review.user_id,
                'real_estate_id': review.real_estate_id
            }
            review_list.append(review_data)

        return jsonify(review_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch reviews', 'error': str(e)}), 500

# Get a single review
@app.route('/reviews/<int:id>', methods=['GET'])
def get_review(id):
    try:
        review = Review.query.get(id)
        review_data = {
            'id': review.id,
            'user_id': review.user_id,
            'real_estate_id': review.real_estate_id,
            'rating': review.rating,
            'comment': review.comment
        }

        return jsonify(review_data), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch review', 'error': str(e)}), 500

# Update a review
@app.route('/reviews/<int:id>', methods=['PATCH'])

def update_review(id):
    data = request.get_json()
    
    review = Review.query.get_or_404(id)
    
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    
    # user_id = get_jwt_identity()
    # if review.user_id != user_id:
    #     return jsonify({'message': 'You are not authorized to update this review'}), 404
    
    if 'rating' in data:
        review.rating = data['rating']
    if 'comment' in data:
        review.comment = data['comment']
    db.session.commit()

    try:
        db.session.commit()
        return jsonify({'message': 'Review updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to update review', 'error': str(e)}), 500

# Delete a review
@app.route('/reviews/<int:id>', methods=['DELETE'])

def delete_review(id):
    review = Review.query.get(id)
    # user_id = get_jwt_identity()

    if not review :
        return jsonify({'message': 'You are not authorized to delete this review'}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted successfully'}), 200

# CRUD FOR PURCHASE 
# Create a new purchase
@app.route('/purchases', methods=['POST'])

def create_purchase():
    data = request.get_json()
    user_id = get_jwt_identity()
    real_estate_id = data['real_estate_id']

    purchase = Purchase(
        user_id=user_id,
        real_estate_id=real_estate_id,
    )
    db.session.add(purchase)
    db.session.commit()

    return jsonify({'message': 'Purchase created successfully'}), 201

# Get all purchases
@app.route('/purchases', methods=['GET'])
def get_purchases():
    try:
        purchases = Purchase.query.all()
        purchase_list = []
        for purchase in purchases:
            purchase_data = {
                'id': purchase.id,
                'user_id': purchase.user_id,
                'real_estate_id': purchase.real_estate_id,
                'date': purchase.date.isoformat()
            }
            purchase_list.append(purchase_data)
        return jsonify(purchase_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch purchases', 'error': str(e)}), 500


# Get a single purchase
@app.route('/purchases/<int:id>', methods=['GET'])
def get_purchase(id):
    try:
        purchase = Purchase.query.get_or_404(id)
        purchase_data = {
            'id': purchase.id,
            'user_id': purchase.user_id,
            'real_estate_id': purchase.real_estate_id,
            'date': purchase.date.isoformat()
        }
        return jsonify(purchase_data), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch purchase', 'error': str(e)}), 500

# Delete a purchase
@app.route('/purchases/<int:id>', methods=['DELETE'])
def delete_purchase(id):
    try:
        purchase = Purchase.query.get(id)

        db.session.delete(purchase)
        db.session.commit()

        return jsonify({'message': 'Purchase deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete purchase', 'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)
