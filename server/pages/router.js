const express = require('express');
const router = express.Router();
const User = require('../auth/User')
const Blog = require('../Blogs/Blog');
const Categories = require('../Categories/Categories');
const i18n = require('i18n'); // Import i18n module

router.get('/', async (req, res) => {
    const allCategories = await Categories.find();
    const blogs = await Blog.find().populate('category').populate('author');

    const currentLanguage = req.language || req.lng; 
    console.log('Current Language:', currentLanguage);

    res.render("index", {
        categories: allCategories,
        user: req.user ? req.user : {},
        blogs,
        currentLanguage,
    });
});


router.get('/login',(req,res)=>{
    const currentLanguage = req.language || req.lng; 

    res.render("login", {user: req.user ? req.user : {},currentLanguage})
})
router.get('/register',(req,res)=>{
    const currentLanguage = req.language || req.lng; 

    res.render("register", {user: req.user ? req.user : {},currentLanguage})
})

router.get('/profile/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.render("profile", { user: user , loginUser: req.user});
    } else {
        res.redirect('/not-found');
    }
});
router.get('/admin/:id', async (req, res) => {
    try {
        const allUsers = await User.find();
        const currentUser = await User.findById(req.params.id);

        res.render("adminProfile", { loginUser: currentUser, users: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/new', async(req, res)=>{
    const allCategories = await Categories.find()
    res.render("newBlog",{categories: allCategories , user: req.user ? req.user : {}})
})
router.get('/edit/:id', async(req, res)=>{
    const allCategories = await Categories.find()
    const blog = await Blog.findById(req.params.id)


    res.render("editBlog",{categories: allCategories, user: req.user ? req.user : {}, blog})
})
router.get('/not-found', (req, res) => {
    res.render("notfound");
});


module.exports = router