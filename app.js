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

//to create all 5 table
// app.get("/install", (req, res) => {
//   //write SQL query code,create table
//   let ProductsTable = `create table if not exists Products(
//    	Product_id int auto_increment primary key,
//     product_name varchar(50) not null,
//     product_url varchar(50) not null
//   );
//   `;
//   //execute created table  query
//   connection.query(ProductsTable, (error) => {
//     if (error) {
//       console.error("Products table is not created", error);
//     } else {
//       console.log("Products table is successfully created");
//     }
//   });
//   let ProductDescriptionTable = `create table if not exists Product_Description(
//   Description_id int auto_increment primary key,
//   Product_id int,
//   Product_brief_description varchar(255) not null,
//   Product_description varchar(500) not null,
//   Product_img varchar(255) not null,
//   Product_link varchar(255) not null,
//   foreign key(Product_id) references Products(Product_id)

//   ) `;

//   // execute product description table
//   connection.query(ProductDescriptionTable, (error) => {
//     if (error) {
//       console.error("product table is not created", error);
//     } else {
//       console.log("product description table is successfully created");
//     }
//   });

//   //price table
//   let ProductPriceTable = `create table if not exists Product_Price(
//    Price_id int auto_increment primary key,
//    Product_id int,
//    Starting_price varchar(100),
//    Price_range varchar(100),
//    foreign key (Product_id) references Products(product_id)
// ) `;
//   //
//   connection.query(ProductPriceTable, (err) => {
//     if (err) {
//       console.error("product price table is not created", err);
//     } else {
//       console.log("product price table is successfully created");
//     }
//   });

//   let userTable = `create table if not exists Users(
//   user_id int auto_increment primary key ,
//   User_name varchar(20) not null,
//   User_password varchar(20) not null
// )`;
//   connection.query(userTable, (error) => {
//     if (error) {
//       console.log("user table is not created", error);
//     } else {
//       console.log("user table is successfully created");
//     }
//   });

//   let orderTable = `create table if not exists Orders(
//    order_id int auto_increment primary key,
//    user_id int,
//    Product_id int,
//    foreign key (Product_id) references Products(Product_id), 
//    foreign key (user_id) references Users(user_id)
// )`;

//   connection.query(orderTable, (err) => {
//     if (err) {
//       console.error("order table is not created", err);
//     } else {
//       console.log("order table is successfully created");
//     }
//   });

//   res.send("Apple website table  is created ");
// });



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


// to enter data with image url from internet
// app.post("/add-product", (req, res) => {
//   const {
//     product_name,
//     product_url,
//     product_brief_description,
//     product_description,
//     product_link,
//     product_img,
//     starting_price,
//     price_range,
//     username,
//     password,
//   } = req.body;

//   // Insert into Products table
//   const insertIntoProducts = `INSERT INTO Products(product_name, product_url) VALUES (?, ?)`;
//   connection.query(insertIntoProducts, [product_name, product_url], (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send("Error inserting product");
//     }

//     console.log("Data inserted into Products table successfully");

//     // Select last inserted Product_id
//     const productIdQuery = `SELECT Product_id FROM Products ORDER BY Product_id DESC LIMIT 1`;
//     connection.query(productIdQuery, (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Error retrieving Product_id");
//       }

//       if (results.length > 0) {
//         const product_Id = results[0].Product_id;

//         // Insert into product_description table
//         const insertIntoProductDesc = `INSERT INTO product_description(Product_id, Product_brief_description, Product_description, Product_img, Product_link) VALUES (?, ?, ?, ?, ?)`;
//         connection.query(
//           insertIntoProductDesc,
//           [
//             product_Id,
//             product_brief_description,
//             product_description,
//             product_img,
//             product_link,
//           ],
//           (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log(
//                 "Data inserted into product_description table successfully"
//               );
//             }
//           }
//         );

//         // Insert into product_price table
//         const insertIntoPrice = `INSERT INTO product_price(Product_id, Starting_price, Price_range) VALUES (?, ?, ?)`;
//         connection.query(
//           insertIntoPrice,
//           [product_Id, starting_price, price_range],
//           (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("Price information successfully inserted");
//             }
//           }
//         );

//         // Insert into users table
//         const insertIntoUser = `INSERT INTO users(User_name, User_password) VALUES (?, ?)`;
//         connection.query(insertIntoUser, [username, password], (error) => {
//           if (error) {
//             console.log(error);
//           } else {
//             console.log("User information inserted successfully");

//             // Select last inserted user_id
//             const userIdQuery = `SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1`;
//             connection.query(userIdQuery, (err, userResults) => {
//               if (err) {
//                 console.log("Error selecting user_id", err);
//               }

//               if (userResults.length > 0) {
//                 const user_Id = userResults[0].user_id;

//                 // Insert into orders table
//                 const insertIntoOrder = `INSERT INTO orders(user_id, Product_id) VALUES (?, ?)`;
//                 connection.query(
//                   insertIntoOrder,
//                   [user_Id, product_Id],
//                   (err) => {
//                     if (err) {
//                       console.log("Error inserting order data", err);
//                     } else {
//                       console.log("New order data inserted successfully");
//                     }
//                   }
//                 );
//               } else {
//                 console.log("No user data found");
//               }
//             });
//           }
//         });
//       } else {
//         console.log("No product data found");
//       }
//     });
//   });

//   res.send("New product added successfully");
// });
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
  // Select Product_id
  const SelectAll = `SELECT *
FROM Products
JOIN product_description ON Products.Product_id = product_description.Product_id
JOIN product_price ON Products.Product_id = product_price.Product_id`;

  connection.query(SelectAll, (err, rows) => {
    let iphone = { Products: [] };
    // console.log(rows);
    iphone.Products = rows;
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
    FROM Products
    JOIN product_description ON Products.Product_id = product_description.Product_id
    JOIN product_price ON Products.Product_id = product_price.Product_id
    WHERE Products.Product_id = ?`;

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
