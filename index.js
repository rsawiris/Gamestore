const pg = require ('pg')
const client = new pg.Client('postgres://localhost/gamestore')
const express = require('express')
const app = express()

app.use(express.json())


// get all videogames
app.get('/api/videogames', async(req,res,next) => {
    try {
      const SQL = `
        SELECT *
        FROM videogames
      `  
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

// get videogame by id
app.get('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
            SELECT * FROM videogames WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

// delete videogame
app.delete('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
            DELETE 
            FROM videogames
            WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

// add videogame
app.post('/api/videogames/:id', async(req,res,next) => {
    try {
        const SQL = `
            INSERT INTO videogames(title, rating, platforms),
            VALUES ($1, $2, $3)
            RETURNING * 
        `
        const response = await client.query(SQL, [req.body.title, req.body.rating, req.body.platforms])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

// update videogame
app.put('/api/videogames/:id', async (req, res, next) => {
    try {
        const SQL = `
        UPDATE videogames
        SET title = $1, rating = $2, platforms = $3
        WHERE id = $4
        RETURNING *
    `

        const response = await client.query(SQL, [req.body.title, req.body.rating, req.body.platforms, req.params.id]) 
        res.send(response.rows[0])
    } catch (error) {
        next(error)  
    }
})

// get all boardgames
app.get('/api/boardgames', async (req,res,next) => {
    try {
        const SQL = `
        SELECT *
        FROM boardgames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

// get single boardgame
app.get('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
            SELECT * FROM boardgames WHERE id=$1
        `
    const response = await client.query(SQL, [req.params.id])
    res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

// delete board game
app.delete('/api/boardgames/:id', async (req,res,next) => {
    try {
      const SQL = `
        DELETE 
        FROM boardgames
        WHERE id = $1
      `  
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

// add boardgame
app.post('/api/boardgames/:id', async(req,res,next) => {
    try {
        const SQL = `
        INSERT INTO boardgames (name, players, playtime)
        VALUES ($1, $2, $3)
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.players, req.body.playtime])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

// update boardgame 
app.put('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
            UPDATE boardgames
            SET name = $1, players = $2, playtime = $3
            WHERE id = $4
            RETURNING *
        `
        
        const response = await client.query(SQL, [req.body.name, req.body.players, req.body.playtime, req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

const start = async () => {
    await client.connect()
    console.log("connected to db")

    const SQL = `
        DROP TABLE IF EXISTS videogames;
        DROP TABLE IF EXISTS boardgames;
        CREATE TABLE boardgames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            players VARCHAR(100),
            playtime VARCHAR(100)
        );
        
        INSERT INTO boardgames (name, players, playtime) VALUES ('Catan', '3-4', '1-1.5 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Monopoly', '2-8', '.5-3 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Sorry', '2-4', '.5 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Risk', '3-6', '1-8 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Risk', '2-4', '1 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Checkers', '2', '.5 hrs');
        INSERT INTO boardgames (name, players, playtime) VALUES ('Chess', '2', '1 hrs');

        CREATE TABLE videogames(
            id SERIAL PRIMARY KEY,
            title VARCHAR(100),
            rating DECIMAL,
            platforms VARCHAR(100)
        );

        INSERT INTO videogames (title, rating, platforms) VALUES ('COD MW3', 2.6, 'PS5, XBOX, PC');
        INSERT INTO videogames (title, rating, platforms) VALUES ('Spider-Man 2', 4.3, 'PS5');
        INSERT INTO videogames (title, rating, platforms) VALUES ('Starflied', 3.1, 'XBOX');
        INSERT INTO videogames (title, rating, platforms) VALUES ('Fortnite', 4.3, 'PS5, XBOX, PC');
        INSERT INTO videogames (title, rating, platforms) VALUES ('GTA San Andreas', 4, 'PS2, XBOX, PC');

    `
    await client.query(SQL)
    console.log("table created and seeded")

    const port = 3002
    app.listen(port, () => {
        console.log(`app listening on ${port}`)
    })
}

start()