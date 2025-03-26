import Book from '../models/Book.js';


const createBook = async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        if (!title || !caption || !rating || !image) {
            return res.status(400).send('All fields are required');
        }

        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const image_url = uploadResponse.secure_url;


        const book = new Book({
            title,
            caption,
            rating,
            image: image_url,
            user: req.user._id,
        });
        await book.save();
        res.status(201).send(book);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }

};

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const totalBooks = await Book.countDocuments();



        const books = await Book.find()
            .sort({ createdAt: -1 }
                .skip(skip)
                .limit(limit)
                .populate("user", "userName", "profileImage")); // sort by newest
        res.status(200).send({
            books,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks: totalBooks
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).send('Not authorized to delete this book');
        }
        // delete the image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            const public_id = book.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }
    


        await book.deleteOne();
        res.status(200).send('Book deleted successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const getRecommendedBook = async (req, res) => {
    try {
        const books = await Book.find().sort({ rating: -1 });
        res.status(200).send(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
export { createBook, getAllBooks , deleteBook, getRecommendedBook};