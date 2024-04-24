const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
// Routes

/**
 * GET
 * HOME
 */

router.get('', async(req,res) => {
    try{

        const locals  = {
            title: "Blog",
            description: "Simple Blog created with NodeJs, Express and MongoDb."
        }

        let perPage = 4;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage );

 
        res.render('index',{
            locals,
            data,
        current: page,
        nextPage: hasNextPage ? nextPage:null
        });

    } catch (error) {

        console.log(error);
    }
    
});




//---------------------------------------->before increasing the pagination complexity
// router.get('', async(req,res) => {

//     const locals  = {
//         title: "Blog",
//         description: "Simple Blog created with NodeJs, Express and MongoDb."
//     }

//     try{
//         const data = await Post.find();
//         res.render('index',{locals,data});
//     } catch (error) {

//         console.log(error);
//     }
    
// });

//------------------------------------------> posting in database is done from here

// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Budgeting Tips",
//             body: "Track expenses, save first, and avoid unnecessary purchases"
//         },
//         {
//             title: "Creating a Recipe",
//             body: "Here's a simple recipe for delicious chocolate chip cookies"
//         },
//         {
//             title: "Morning Yoga Routine",
//             body: "Start your day with a few gentle stretches and deep breaths"
//         },
//         {
//             title: "Effective Time Management",
//             body: "“Prioritize tasks, set deadlines, and avoid multitasking."
//         },
//         {
//             title: "Learning a New Language",
//             body: "Practice daily, use language apps, and immerse yourself"
//         },
//         {
//             title: "Indoor Plant Care",
//             body: "Water once a week, provide indirect sunlight, and dust leaves"
//         },
//         {
//             title: "Basic Coding Concepts",
//             body: "Understand variables, loops, and conditional statements"
//         },
//         {
//             title: "Effective Study Habits",
//             body: "“Create a quiet space, take breaks, and review regularly"
//         },
//     ])
// }

// insertPostData();


/**
 * GET
 * POST:id
 */

router.get('/post/:id', async(req,res) => {
    try{
        let slug = req.params.id;



        const data = await Post.findById({_id: slug});

        const locals  = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express and MongoDb."
        }

        res.render('post',{locals,data});
    } catch (error) {

        console.log(error);
    }

});


/**
 * GET
 * POST - searchTerm
 */

router.post('/search', async(req,res) => {

    try{
        const locals  = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express and MongoDb."
        }
    
        let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });

          //  const data = await Post.find();
            res.render("search", {
                data,
                locals
            });
        } catch (error) {
    
            console.log(error);
        }
        
 });











router.get('/about',(req,res)=>{
    res.render('about');
});









module.exports=router;
