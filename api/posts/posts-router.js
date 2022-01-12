// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()


router.get('/', (req, res) => {
    Post.find()
        .then(found => {
            res.json(found)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message
            })
        })
})
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log('--->', post)
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
                res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post with the specified ID does not exist",
            err: err.message
        })
    }
})
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        console.log('success')
        Post.insert({ title, contents })
        .then( ({id}) => {  
            console.log('check -->', id)
            return Post.findById(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
                err: err.message
            })
        })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.status(200).json({post, message: "This post was deleted"})
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message
        })
    }
})
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if ( !title || !contents ) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(req.params.id)
        .then( possiblepost => {
            if (!possiblepost) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Post.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if(data){
                return Post.findById(req.params.id) 
            }
        })
        .then(post => {
            if (post) {
                res.json(post) 
            } 
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be modified",
                err: err.message,
                stack: err.stack
            })
        })

    }

})
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log('--->', post)
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        } 
    }   catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message
        })
    }
})


module.exports = router