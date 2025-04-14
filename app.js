//import mysql2 module
let mysql = require("mysql2");

//import express
let express = require("express");

//Initialize Express Application: Create an Express instance to manage the server.
let app = express();

//to give access my database from any requester
const cors = require("cors");
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//for image URL from internet
//create connection to MYSQL software
let connection = mysql.createConnection({
  //from mamp

  // host: "localhost",
  // user: "myDBuser",
  // password: "Yibie",
  // database: "mydb",

  //free online database
  host: "sql5.freesqldatabase.com",
  user: "sql5772871",
  password: "WLdgdMHZKd",
  database: "sql5772871",
  port: "3306",
});

//create connection with database
connection.connect(function (err) {
  if (err) {
    console.error("it is not connected with the database", err);
  } else {
    console.log(
      "congratulation !!!, it is successfully connected with database"
    );
  }
});

//to text on browser when server is work fine
app.get("/", function (request, response) {
  response.send("<h2>Server is running on port number 1234</h2>");
});

//to create all 5 table
app.get("/install", (req, res) => {
  //write SQL query code,create table
  let productsTable = `create table if not exists Products(
   	Product_id int auto_increment primary key,
    product_name varchar(50) not null,
    product_url varchar(50) not null
  );
  `;
  //execute created table  query
  connection.query(productsTable, (error) => {
    if (error) {
      console.error("products table is not created", error);
    } else {
      console.log("products table is successfully created");
    }
  });
  let ProductDescriptionTable = `create table if not exists Product_Description(
  Description_id int auto_increment primary key,
  Product_id int,
  Product_brief_description varchar(255) not null,
  Product_description varchar(500) not null,
  Product_img varchar(255) not null,
  Product_link varchar(255) not null,
  foreign key(Product_id) references products(Product_id)

  ) `;

  // execute product description table
  connection.query(ProductDescriptionTable, (error) => {
    if (error) {
      console.error("product table is not created", error);
    } else {
      console.log("product description table is successfully created");
    }
  });

  //price table
  let ProductPriceTable = `create table if not exists Product_Price(
   Price_id int auto_increment primary key,
   Product_id int,
   Starting_price varchar(100),
   Price_range varchar(100),
   foreign key (Product_id) references products(product_id)
) `;
  //
  connection.query(ProductPriceTable, (err) => {
    if (err) {
      console.error("product price table is not created", err);
    } else {
      console.log("product price table is successfully created");
    }
  });

  let userTable = `create table if not exists Users(
  user_id int auto_increment primary key ,
  User_name varchar(20) not null,
  User_password varchar(20) not null
)`;
  connection.query(userTable, (error) => {
    if (error) {
      console.log("user table is not created", error);
    } else {
      console.log("user table is successfully created");
    }
  });

  let orderTable = `create table if not exists Orders(
   order_id int auto_increment primary key,
   user_id int,
   Product_id int,
   foreign key (Product_id) references Products(Product_id), 
   foreign key (user_id) references Users(user_id)
)`;

  connection.query(orderTable, (err) => {
    if (err) {
      console.error("order table is not created", err);
    } else {
      console.log("order table is successfully created");
    }
  });

  res.send("Apple website table  is created ");
});

// to enter data with image url from internet
app.post("/add-product", (req, res) => {
  const {
    product_name,
    product_url,
    product_brief_description,
    product_description,
    product_link,
    product_img,
    starting_price,
    price_range,
    username,
    password,
  } = req.body;

  // Insert into products table
  const insertIntoProducts = `INSERT INTO products(product_name, product_url) VALUES (?, ?)`;
  connection.query(insertIntoProducts, [product_name, product_url], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error inserting product");
    }

    console.log("Data inserted into products table successfully");

    // Select last inserted Product_id
    const productIdQuery = `SELECT Product_id FROM products ORDER BY Product_id DESC LIMIT 1`;
    connection.query(productIdQuery, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving Product_id");
      }

      if (results.length > 0) {
        const product_Id = results[0].Product_id;

        // Insert into product_description table
        const insertIntoProductDesc = `INSERT INTO product_description(Product_id, Product_brief_description, Product_description, Product_img, Product_link) VALUES (?, ?, ?, ?, ?)`;
        connection.query(
          insertIntoProductDesc,
          [
            product_Id,
            product_brief_description,
            product_description,
            product_img,
            product_link,
          ],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(
                "Data inserted into product_description table successfully"
              );
            }
          }
        );

        // Insert into product_price table
        const insertIntoPrice = `INSERT INTO product_price(Product_id, Starting_price, Price_range) VALUES (?, ?, ?)`;
        connection.query(
          insertIntoPrice,
          [product_Id, starting_price, price_range],
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Price information successfully inserted");
            }
          }
        );

        // Insert into users table
        const insertIntoUser = `INSERT INTO users(User_name, User_password) VALUES (?, ?)`;
        connection.query(insertIntoUser, [username, password], (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("User information inserted successfully");

            // Select last inserted user_id
            const userIdQuery = `SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1`;
            connection.query(userIdQuery, (err, userResults) => {
              if (err) {
                console.log("Error selecting user_id", err);
              }

              if (userResults.length > 0) {
                const user_Id = userResults[0].user_id;

                // Insert into orders table
                const insertIntoOrder = `INSERT INTO orders(user_id, Product_id) VALUES (?, ?)`;
                connection.query(
                  insertIntoOrder,
                  [user_Id, product_Id],
                  (err) => {
                    if (err) {
                      console.log("Error inserting order data", err);
                    } else {
                      console.log("New order data inserted successfully");
                    }
                  }
                );
              } else {
                console.log("No user data found");
              }
            });
          }
        });
      } else {
        console.log("No product data found");
      }
    });
  });

  res.send("New product added successfully");
});

//select data from products when the request url is /iPhone
app.get("/iPhone", (req, res) => {
  // Select Product_id
  const SelectAll = `SELECT *
FROM products
JOIN product_description ON products.Product_id = product_description.Product_id
JOIN product_price ON products.Product_id = product_price.Product_id`;

  connection.query(SelectAll, (err, rows) => {
    let iphone = { products: [] };
    // console.log(rows);
    iphone.products = rows;
    var stringIphone = JSON.stringify(iphone);
    if (!err) {
      // console.log(stringIphone);
      res.end(stringIphone);
    } else {
      console.log("error happened");
    }
  });
});

//to test
app.get("/iPhone/:ProductId", (req, res) => {
  const ProductId = req.params.ProductId;

  // Query to fetch a single product
  const query = `
    SELECT *
    FROM products
    JOIN product_description ON products.Product_id = product_description.Product_id
    JOIN product_price ON products.Product_id = product_price.Product_id
    WHERE products.Product_id = ?`;

  connection.query(query, [ProductId], (err, rows) => {
    if (err) {
      console.log("Error fetching product:", err);
      res.status(500).send("Server Error");
    } else if (rows.length === 0) {
      res.status(404).send("Product not found");
    } else {
      console.log(ProductId);
      res.json(rows[0]); // Assuming there's only one result
    }
  });
});

//connect created server with port number for image URL
app.listen(1234, (err) => {
  if (err) {
    console.error("error happen", err);
  } else {
    console.log("the server is running on http://localhost:1234");
  }
});
