var uniqid = require('uniqid')
const fs = require('fs')
const path = require('path')

const p = path.join(
    '../node-mongo',
    'data',
    'courses.json'
)

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
        console.log(courses);
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
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

    static async getByID(id) {
        const courses = await Course.getAll();
        return courses.find(c => c.id == id)

    }

    static async update(course) {
        const courses = await Course.getAll();
        const idx = courses.findIndex(c => c.id == course.id)
        courses[idx] = course

        return new Promise((resolve, reject) => {
            fs.writeFile(
                p,
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }
}

module.exports = Course