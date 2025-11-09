//import mysql2 module
let mysql = require("mysql2");

//import express
let express = require("express");
const path = require("path");

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
  host: "sql10.freesqldatabase.com",
  user: "sql10806855",
  password: "4r5wxcBxbG",
  database: "sql10806855",
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

app.get("/install", (req, res) => {
  // Ensure all tables use InnoDB (supports foreign keys)
  let ProductsTable = `
    CREATE TABLE IF NOT EXISTS Products(
      Product_id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(50) NOT NULL,
      product_url VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB;
  `;

  connection.query(ProductsTable, (error) => {
    if (error) {
      console.error("Products table not created:", error);
    } else {
      console.log("✅ Products table created");
    }
  });

  let ProductDescriptionTable = `
    CREATE TABLE IF NOT EXISTS Product_Description(
      Description_id INT AUTO_INCREMENT PRIMARY KEY,
      Product_id INT,
      Product_brief_description VARCHAR(255) NOT NULL,
      Product_description VARCHAR(500) NOT NULL,
      Product_img VARCHAR(255) NOT NULL,
      Product_link VARCHAR(255) NOT NULL,
      FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  connection.query(ProductDescriptionTable, (error) => {
    if (error) {
      console.error("❌ Product_Description table not created:", error);
    } else {
      console.log("✅ Product_Description table created");
    }
  });

  let ProductPriceTable = `
    CREATE TABLE IF NOT EXISTS Product_Price(
      Price_id INT AUTO_INCREMENT PRIMARY KEY,
      Product_id INT,
      Starting_price VARCHAR(100),
      Price_range VARCHAR(100),
      FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  connection.query(ProductPriceTable, (err) => {
    if (err) {
      console.error("❌ Product_Price table not created:", err);
    } else {
      console.log("✅ Product_Price table created");
    }
  });

  let userTable = `
    CREATE TABLE IF NOT EXISTS Users(
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      User_name VARCHAR(20) NOT NULL,
      User_password VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB;
  `;

  connection.query(userTable, (error) => {
    if (error) {
      console.log("❌ Users table not created:", error);
    } else {
      console.log("✅ Users table created");
    }
  });

  let orderTable = `
    CREATE TABLE IF NOT EXISTS Orders(
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      Product_id INT,
      FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  connection.query(orderTable, (err) => {
    if (err) {
      console.error("❌ Orders table not created:", err);
    } else {
      console.log("✅ Orders table created");
    }
  });

  res.send("✅ All Apple website tables are created successfully!");
});



app.post("/add-product", async (req, res) => {
  const {
    product_name, product_url,
    product_brief_description, product_description,
    product_img, product_link,
    starting_price, price_range,
    username, password
  } = req.body;

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.beginTransaction(err => {
    if (err) return res.status(500).send("Transaction start failed: " + err);

    // Insert into Products (note uppercase P)
    connection.query(
      "INSERT INTO Products(product_name, product_url) VALUES (?, ?)",
      [product_name, product_url],
      (err, productResult) => {
        if (err) return connection.rollback(() => res.status(500).send(err));
        const productId = productResult.insertId;

        // Insert into Product_Description (note exact table name)
        connection.query(
          "INSERT INTO Product_Description(Product_id, Product_brief_description, Product_description, Product_img, Product_link) VALUES (?, ?, ?, ?, ?)",
          [productId, product_brief_description, product_description, product_img, product_link],
          (err) => {
            if (err) return connection.rollback(() => res.status(500).send(err));

            // Insert into Product_Price
            connection.query(
              "INSERT INTO Product_Price(Product_id, Starting_price, Price_range) VALUES (?, ?, ?)",
              [productId, starting_price, price_range],
              (err) => {
                if (err) return connection.rollback(() => res.status(500).send(err));

                // Insert into Users
                connection.query(
                  "INSERT INTO Users(User_name, User_password) VALUES (?, ?)",
                  [username, hashedPassword],
                  (err, userResult) => {
                    if (err) return connection.rollback(() => res.status(500).send(err));
                    const userId = userResult.insertId;

                    // Insert into Orders
                    connection.query(
                      "INSERT INTO Orders(user_id, Product_id) VALUES (?, ?)",
                      [userId, productId],
                      (err) => {
                        if (err) return connection.rollback(() => res.status(500).send(err));

                        // Commit transaction
                        connection.commit(err => {
                          if (err) return connection.rollback(() => res.status(500).send(err));
                          res.send("✅ Product and order added successfully!");
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});



//select data from Products when the request url is /iPhone
app.get("/iPhone", (req, res) => {
  const SelectAll = `
    SELECT *
    FROM Products
    JOIN Product_Description ON Products.Product_id = Product_Description.Product_id
    JOIN Product_Price ON Products.Product_id = Product_Price.Product_id
  `;

  connection.query(SelectAll, (err, rows) => {
    if (err) {
      console.error("Error happened:", err);
      return res.status(500).send("Database Error");
    }
    res.json({ Products: rows });
  });
});


//to test
app.get("/iPhone/:ProductId", (req, res) => {
  const ProductId = req.params.ProductId;

  const query = `
    SELECT *
    FROM Products
    JOIN Product_Description ON Products.Product_id = Product_Description.Product_id
    JOIN Product_Price ON Products.Product_id = Product_Price.Product_id
    WHERE Products.Product_id = ?
  `;

  connection.query(query, [ProductId], (err, rows) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).send("Server Error");
    }
    if (rows.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.json(rows[0]);
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
