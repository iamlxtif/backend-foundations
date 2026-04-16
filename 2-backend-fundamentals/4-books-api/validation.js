export const validateBook = (book) => {
    const errors = [];

    if(!book.title || book.title.trim().length < 1){
        errors.push('Title is requires');
    } else if(book.title.length > 200){
        errors.push('Title must be less than 200 characteres');
    }

    if(!book.author || book.author.trim().length < 1){
        errors.push('Author is requires');
    } else if(book.author.length > 100){
        errors.push('Author must be less than 100 characteres');
    }

    if(book.year){
        const year = parseInt(book.year);
        const currentYear = new Date().getFullYear();
        if(isNaN(year) || year < 1000 || year > currentYear + 1){
            errors.push(`Year must be between 1000 and ${currentYear + 1}`);
        }
    }

    const validGenres = ['fiction', 'non-fiction', 'dystopian', 'romance', 'mystery', 'programming', 'science', 'history', 'biography', 'uncategorized'];
    if(book.genre && !validGenres.includes(book.genre.toLowerCase())){
        errors.push(`Genre must be one of: ${validGenres.join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const checkDuplicate = (books, title, author, excludeId = null) => {
    return books.some(b =>
        b.id !== excludeId &&
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase()
    );
};