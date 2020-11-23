# Check-Me In

## Description

A comunity-blog where people can share their experiences traveling around the globe
No Rules! Be Nice to others, share your experience let us know what you think about the places you visited and enjoy a daily trip reading about the amazing experiences that others like you had while visting new places.
Is everything about learning and discover

## Trello

https://trello.com/b/mQ4jWUj7/check-me-in-second-module-project

## Pages

###### Must

• Home Page - Any user can have acces to the home page
• Sign Up Page - Any user can acces and fill out the sign up form /page
• Login in Page - Any user can acces the Login form/page only register user can fill out the form
• User-Profile Page - Logged in User Only, only relevant to the user logged in
• Update Profile Page - Logged in User Only, only relevant to the user logged in
• Make a Post- Page - Logged in User Only, It will displat the pot in his profile and in the gallery
• Gallery of Post Page - Any User can acces the galery
• Read Full Post Page - Logged in User Only can acces to the Full post from the gallery

###### Wish List

• Comunity Page - Logged in User Only can see the list of all users and add them as friends

## Schemas

• User Model

- Username: String,required and unique
- About: String
- Email: String, required, unique,
- Password: String, required
- Picture: String
- Location: String
- Posts: Object -Post Schema

• Post Model

- Country: String, requeried
- City:String
- Budget:Number
- Currency: String can have only two values USD or EUR
- Days:Number
- when: Date
- CreatedAt: Date default to now
- Title:String
- Description:String
- Body: String,
- Image: String,
- Likes:Object - User Schema
- LikeCount: Number, default to zero
- Author: Object - User Schema

## Routes

• get() method

- router.get('/home')
- router.get('User/Signup')
- router.get('User/Login')
- router.get('User/Profile')
- router.get('User/Settings')
- router.get('User/Newpost')
- router.get('User/Post/Edit')
- router.get('/Posts')
- router.get('/Posts/PostID')

• post() method

router.post('/signup')
router.post('/login')
router.post('/logout')
router.post('Post/edit/postId')
router.post('Post/deletePost/postId')
router.post('User/settings')
router.post('User/updatePassword')
router.post('User/newpost')
