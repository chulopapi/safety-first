const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Business } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    // console.log("Dashboard-routes.js line 7", req.session);

    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
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
            'created_at',
        ],
        include: [
            {
                model: Business,
                attributes: [
                    'name',
                    'business_url',
                ],
            },
        ]

    })
        .then(dbPostData => {
            //         // pass a single post object into the homepage template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            console.log(posts)
            res.render('dashboard', {
                posts,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', (req, res) => {
    console.log(req.params.id),
        Post.findOne({
            where: {
                id: req.params.id
            },
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
                'created_at',
            ],
            include: [
                {
                    model: Business,
                    attributes: [
                        'name',
                        'Business_url',
                    ],
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ],
        })
            .then(dbPostData => {
                // console.table("response from the db: ");
                // console.table(dbPostData);
                if (!dbPostData) {
                    res.status(404).json({ message: 'No post found with this id' });
                    return;
                }
                // serialize the data
                const post = dbPostData.get({ plain: true });
                // pass data to template
                res.render('edit-post', {
                    post,
                    // loggedIn: req.session.loggedIn,
                    loggedIn: true
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
});
module.exports = router;