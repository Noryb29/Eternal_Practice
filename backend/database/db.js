import pg from 'pg'

const dbpool = new pg.Pool({
    user:"",
    host:'',
    database:''

})

export default dbpool