# BookExpress - API Testing Guide

Test the BookExpress API using curl commands. Make sure the backend is running on port 5000.

## Setup Variables

```bash
# Base URL
BASE_URL="http://localhost:5000/api"

# Or set environment variable
export BASE_URL="http://localhost:5000/api"
```

## 1. Authentication API

### Register User
```bash
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

Response includes:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Login User
```bash
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "loginField": "john@example.com",
    "password": "123456"
  }'
```

### Get User Profile
```bash
# Replace TOKEN with actual token from login
TOKEN="your_jwt_token_here"

curl -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### Update User Profile
```bash
curl -X PUT "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+1234567891",
    "address": "123 Main St",
    "city": "New York"
  }'
```

## 2. Books API

### Get All Books
```bash
curl -X GET "$BASE_URL/books"
```

### Get Single Book
```bash
# Replace BOOK_ID with actual book ID
curl -X GET "$BASE_URL/books/BOOK_ID"
```

### Add Book (Admin Only)
```bash
ADMIN_TOKEN="admin_jwt_token_here"

curl -X POST "$BASE_URL/books" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "price": 29.99,
    "author": "Book Author",
    "description": "Book description",
    "image": "https://example.com/book.jpg",
    "stock": 10
  }'
```

### Update Book (Admin Only)
```bash
BOOK_ID="book_id_here"

curl -X PUT "$BASE_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "price": 24.99,
    "stock": 15
  }'
```

### Delete Book (Admin Only)
```bash
curl -X DELETE "$BASE_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 3. Orders API

### Create Order
```bash
USER_TOKEN="user_jwt_token_here"

curl -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "books": [
      {
        "bookId": "book_id_1",
        "quantity": 2,
        "price": 12.99
      },
      {
        "bookId": "book_id_2",
        "quantity": 1,
        "price": 14.99
      }
    ],
    "totalPrice": 40.97,
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "deliveryType": "courier",
    "paymentMethod": "card"
  }'
```

### Get User Orders
```bash
curl -X GET "$BASE_URL/orders/my-orders" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Get All Orders (Admin Only)
```bash
curl -X GET "$BASE_URL/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Update Order Status (Admin Only)
```bash
ORDER_ID="order_id_here"

curl -X PUT "$BASE_URL/orders/$ORDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_delivery"
  }'
```

Valid statuses: `new`, `in_delivery`, `delivered`

## 4. Couriers API

### Submit Courier Application
```bash
curl -X POST "$BASE_URL/couriers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Courier Name",
    "phone": "+1234567890",
    "email": "courier@gmail.com",
    "city": "New York",
    "comment": "I have my own vehicle"
  }'
```

### Get Courier Applications (Admin Only)
```bash
curl -X GET "$BASE_URL/couriers" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Update Courier Status (Admin Only)
```bash
COURIER_ID="courier_id_here"

curl -X PUT "$BASE_URL/couriers/$COURIER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

Valid statuses: `pending`, `accepted`, `rejected`

## 5. Health Check

### Check Backend Status
```bash
curl -X GET "$BASE_URL/health"
```

Response:
```json
{"status":"Backend is running"}
```

## Useful Curl Options

```bash
# Pretty print JSON response
curl ... | jq

# Save response to file
curl ... -o response.json

# Show headers
curl -i ...

# Verbose output (debugging)
curl -v ...

# Write cookies to file
curl ... -c cookies.txt

# Read cookies from file
curl ... -b cookies.txt

# Custom user agent
curl -A "Mozilla/5.0" ...
```

## Example: Complete User Journey with Curl

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# 1. Register
echo "1. Registering user..."
REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+1234567890",
    "email": "test@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }')

TOKEN=$(echo $REGISTER | jq -r '.token')
echo "Token: $TOKEN"

# 2. Get profile
echo -e "\n2. Getting user profile..."
curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Get books
echo -e "\n3. Getting books..."
BOOKS=$(curl -s -X GET "$BASE_URL/books")
BOOK_ID=$(echo $BOOKS | jq -r '.[0]._id')
echo "First book ID: $BOOK_ID"

# 4. Create order
echo -e "\n4. Creating order..."
curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"books\": [
      {
        \"bookId\": \"$BOOK_ID\",
        \"quantity\": 1,
        \"price\": 12.99
      }
    ],
    \"totalPrice\": 12.99,
    \"name\": \"Test User\",
    \"phone\": \"+1234567890\",
    \"address\": \"123 Main St\",
    \"city\": \"New York\",
    \"deliveryType\": \"courier\",
    \"paymentMethod\": \"card\"
  }" | jq

# 5. Get user orders
echo -e "\n5. Getting user orders..."
curl -s -X GET "$BASE_URL/orders/my-orders" \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Error Responses

### Invalid Token
```json
{"error":"Invalid token"}
```

### Missing Required Fields
```json
{"error":"All fields are required"}
```

### Unauthorized (Admin Only)
```json
{"error":"Access denied. Admin only."}
```

### Resource Not Found
```json
{"error":"Book not found"}
```

### Validation Error
```json
{"error":"Price must be positive"}
```

## Tips for API Testing

1. **Use Postman**: Can save and organize requests
2. **jq tool**: Format JSON responses: `curl ... | jq`
3. **Save token**: Store token in variable for multiple requests
4. **Check headers**: Use `-i` flag to see response headers
5. **Debug mode**: Use `-v` for verbose output
6. **Test errors**: Try invalid data to see error handling

## Testing Workflow

1. ✅ Register a new user → Get token
2. ✅ Get books list
3. ✅ Get single book
4. ✅ Create order with user token
5. ✅ Get user orders
6. ✅ Test admin endpoints (use admin token)
7. ✅ Test error cases (invalid data)

---

Happy API Testing! 🚀
