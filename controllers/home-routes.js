const router = require('express').Router();
const sequelize = require('../config/connection');
const { Business, User, Category, Post } = require('../models');

router.get('/', (req, res) => {

    Business.findAll({
        attributes: [
            'id',
            'name',
            'business_url',
        ],
        include: [
            {
                model: Category,
                attributes: ['name'],
            },
            {
                model: Post,
                attributes:[
                    'id',
                    'title',
                    'post_text',
                    'mask_required',
                    'staff_mask',
                    'staff_gloves',
                    'contactless_payment',
                    'handsanitizer_provided',
                    'social_distancing',
                ]
        }

        ]
    
    })
        .then(dbPostData => {
            // pass a single post object into the homepage template
            
            const businesses = dbPostData.map(business => business.get({ plain: true }));
            // console.log("businessssss", businesses)

            businesses.map(singleBusiness=>{
                console.log( 'get all of em',
                    Object.values(singleBusiness))
            })

            res.render('homepage', {
                businesses,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

// router.get('/add-business', (req, res) => {
   

//     res.render('add-business');
// });

//open single business
router.get('/business/:id', (req, res) => {
    Business.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
            'business_url'
        ],
        include: [
            {
                model: Category,
                attributes: ['id', 'name'],
            },
            {
                model: Post,
                attributes: [
                    'id',
                    'title',
                    'post_text',
                    'mask_required',
                    'staff_mask',
                    'staff_gloves',
                    'contactless_payment',
                    'handsanitizer_provided',
                    'social_distancing',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(dbBusinessData => {
            // console.log(dbBusinessData)
            if (!dbBusinessData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const business = dbBusinessData.get({ plain: true });
            console.log('singlebiz business', business)
                bizPosts = business.posts
            // pass data to template
            res.render('single-business', {
                business,
               
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log("error",err);
            res.status(500).json(err);
        });
});

module.exports = router;