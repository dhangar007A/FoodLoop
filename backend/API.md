# FoodLoop Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT tokens stored in HTTP-only cookies. Include `withCredentials: true` in your requests.

---

## Auth Endpoints

### User Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/user/register` | Register new user |
| POST | `/auth/user/login` | Login user |
| GET | `/auth/user/logout` | Logout user |

### Food Partner Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/food-partner/register` | Register new food partner |
| POST | `/auth/food-partner/login` | Login food partner |
| GET | `/auth/food-partner/logout` | Logout food partner |

---

## Food Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/food` | Get all food items | User |
| POST | `/food` | Create food item | Food Partner |
| GET | `/food/:foodId` | Get single food item | User |
| POST | `/food/like` | Like/unlike food | User |
| POST | `/food/save` | Save/unsave food | User |
| GET | `/food/save` | Get saved foods | User |
| POST | `/food/:foodId/view` | Increment view count | User |
| GET | `/food/category/:category` | Get foods by category | User |

---

## User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/user/profile` | Get user profile | User |
| PATCH | `/user/profile` | Update user profile | User |
| PATCH | `/user/password` | Change password | User |
| GET | `/user/liked` | Get liked videos | User |
| GET | `/user/following-feed` | Get following feed | User |

---

## Food Partner Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/food-partner/:id` | Get food partner profile | User |

---

## Comment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/comments/:foodId` | Get comments for food | User |
| POST | `/comments` | Add comment | User |
| GET | `/comments/:commentId/replies` | Get replies | User |
| POST | `/comments/:commentId/like` | Like comment | User |
| DELETE | `/comments/:commentId` | Delete comment | User |

### Add Comment Body
```json
{
  "foodId": "string",
  "text": "string",
  "parentComment": "string (optional)"
}
```

---

## Follow Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/follow/:foodPartnerId` | Toggle follow | User |
| GET | `/follow/check/:foodPartnerId` | Check if following | User |
| GET | `/follow/following` | Get following list | User |
| GET | `/follow/followers` | Get followers | Food Partner |

---

## Rating Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ratings` | Add/update rating | User |
| GET | `/ratings/:foodPartnerId` | Get ratings for partner | User |
| GET | `/ratings/:foodPartnerId/user` | Get user's rating | User |
| DELETE | `/ratings/:foodPartnerId` | Delete rating | User |

### Add Rating Body
```json
{
  "foodPartnerId": "string",
  "rating": 1-5,
  "review": "string (optional)"
}
```

---

## Notification Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | Get notifications | User |
| GET | `/notifications/food-partner` | Get notifications | Food Partner |
| PATCH | `/notifications/:id/read` | Mark as read | User |
| PATCH | `/notifications/read-all` | Mark all as read | User |
| DELETE | `/notifications/:id` | Delete notification | User |

---

## Search Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/search/food?q=query` | Search food items | User |
| GET | `/search/food-partners?q=query` | Search food partners | User |
| GET | `/search/trending` | Get trending foods | User |
| GET | `/search/categories` | Get all categories | User |
| GET | `/search/explore` | Get explore page data | User |

### Search Query Parameters
- `q`: Search query
- `category`: Filter by category
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort by (latest, popular, trending)

---

## Categories
Available food categories:
- Pizza
- Burger
- Sushi
- Mexican
- Italian
- Chinese
- Indian
- Thai
- Dessert
- Drinks
- Breakfast
- Healthy
- Fast Food
- Street Food
- Other

---

## Error Responses
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Responses
```json
{
  "success": true,
  "message": "Success description",
  "data": {}
}
```

---

## Rate Limiting
- 100 requests per minute per IP
- 429 status code when exceeded
