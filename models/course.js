var uniqid = require('uniqid')
const fs = require('fs')
const path = require('path')

class Course {

    constructor(name, price, image) {
         this.name = name,
        this.price = price,
        this.image = image,
        this.id = uniqid()
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            price: this.price,
            image: this.image,
            id: this.id
        })
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON())

        console.log('Courses', courses)
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err,content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }

                }
            )
        })
    }
}

module.exports = Course