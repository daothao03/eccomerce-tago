const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./utiles/db");

const socket = require("socket.io");
const http = require("http");
const server = http.createServer(app);

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

var allCustomer = [];
var allSeller = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some((u) => u.customerId === customerId);
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo,
        });
    }
};

const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some((u) => u.sellerId === sellerId);
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo,
        });
    }
};

const findCustomer = (customerId) => {
    return allCustomer.find((c) => c.customerId === customerId);
};

const findSeller = (sellerId) => {
    return allSeller.find((c) => c.sellerId === sellerId);
};

const remove = (socketId) => {
    allCustomer = allCustomer.filter((c) => c.socketId !== socketId);
    allSeller = allSeller.filter((s) => s.socketId !== socketId);
};

io.on("connection", (soc) => {
    console.log("Socket server running...");

    soc.on("add_user", (customerId, userInfo) => {
        addUser(customerId, soc.id, userInfo);
        io.emit("activeSeller", allSeller);
        // console.log(allCustomer);
    });

    soc.on("add_seller", (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit("activeSeller", allSeller);
        // console.log(allSeller);
    });

    //seller: sender, customer: receiver
    soc.on("send_seller_message", (msg) => {
        const customer = findCustomer(msg.receiverId);
        if (customer !== undefined) {
            soc.to(customer.socketId).emit("seller_message", msg);
        }
    });

    //customer: sender, seller: receiver
    soc.on("send_customer_message", (msg) => {
        const seller = findSeller(msg.receiverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit("customer_message", msg);
        }
    });

    soc.on("send_message_admin_to_seller", (msg) => {
        const seller = findSeller(msg.receiverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit("received_admin_message", msg);
        }
    });

    soc.on("send_message_seller_to_admin", (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit("received_seller_message", msg);
        }
    });

    soc.on("add_admin", (adminInfo) => {
        // console.log(adminInfo);
        delete adminInfo.email; // hidden email
        delete adminInfo.password; // hidden email
        admin = adminInfo;
        admin.socketId = soc.id;
        io.emit("activeSeller", allSeller);
    });

    soc.on("disconnect", () => {
        console.log("user disconnect");
        remove(soc.id);
        io.emit("activeSeller", allSeller);
    });
});

require("dotenv").config();

//phan tich CP JSON
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", require("./routes/authRoutes"));

app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/dashboard/dashboardRoutes"));

app.use("/api/home", require("./routes/home/homeRoutes"));
app.use("/api", require("./routes/home/customerAuthRoutes"));
app.use("/api", require("./routes/home/cardRoutes"));
app.use("/api", require("./routes/order/orderRoutes"));

app.use("/api", require("./routes/chatRoutes"));

app.use("/api", require("./routes/paymentRoutes"));

app.get("/", (req, res) => res.send("My backend"));

const port = process.env.PORT;
dbConnect();
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
